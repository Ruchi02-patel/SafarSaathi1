const { ServiceMaintenance, Vehicle, Notification, Expense } = require('../models');

// @desc    Get user's service and maintenance history with summary stats
// @route   GET /api/services
exports.getServices = async (req, res) => {
  try {
    const { vehicleId } = req.query;
    let query = { userId: req.user.id };

    if (vehicleId && vehicleId !== 'All') {
      query.vehicleId = vehicleId;
    }

    const services = await ServiceMaintenance.find(query)
      .populate('vehicleId', 'vehicleNumber brand model')
      .sort({ serviceDate: -1 });

    // Analytics: Last Service, Next Service, Total Services
    let lastService = null;
    let nextService = null;
    let nextServiceDays = null;

    const completed = services.filter((s) => s.status === 'Completed');
    if (completed.length > 0) {
      lastService = completed[0];
    }

    const upcoming = services
      .filter((s) => s.nextServiceDate && new Date(s.nextServiceDate) >= new Date())
      .sort((a, b) => new Date(a.nextServiceDate) - new Date(b.nextServiceDate));

    if (upcoming.length > 0) {
      nextService = upcoming[0];
      const diff = new Date(nextService.nextServiceDate).getTime() - new Date().getTime();
      nextServiceDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    res.json({
      success: true,
      count: services.length,
      stats: {
        totalServices: services.length,
        lastServiceDate: lastService ? lastService.serviceDate : null,
        nextServiceDate: nextService ? nextService.nextServiceDate : null,
        nextServiceDays: nextServiceDays
      },
      services,
      data: services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new service record
// @route   POST /api/services
exports.createService = async (req, res) => {
  try {
    const {
      vehicleId,
      serviceType,
      serviceDate,
      nextServiceDate,
      mileage,
      cost,
      description,
      serviceCenter,
      status
    } = req.body;

    if (!vehicleId || !serviceType || !nextServiceDate || !serviceCenter) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle, service type, next service date, and service center are required.'
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (vehicle.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized for this vehicle.' });
    }

    const numCost = cost ? Number(cost) : 0;
    const sDate = serviceDate ? new Date(serviceDate) : new Date();

    const service = await ServiceMaintenance.create({
      userId: req.user.id,
      vehicleId,
      serviceType,
      serviceDate: sDate,
      nextServiceDate: new Date(nextServiceDate),
      mileage: mileage ? Number(mileage) : 0,
      cost: numCost,
      description: description ? description.trim() : '',
      serviceCenter: serviceCenter.trim(),
      status: status || 'Completed'
    });

    // Auto-create expense record for service cost
    if (numCost > 0) {
      await Expense.create({
        userId: req.user.id,
        vehicleId,
        category: 'Service',
        amount: numCost,
        description: `${serviceType} at ${serviceCenter.trim()}${description ? ' (' + description.trim() + ')' : ''}`,
        date: sDate,
        paymentMethod: 'UPI'
      });
    }

    // Upsert / sync service reminder notification for this vehicle
    const diffDays = Math.ceil((new Date(nextServiceDate) - new Date()) / (1000 * 60 * 60 * 24));
    let notif = await Notification.findOne({
      userId: req.user.id,
      vehicleId: vehicle._id,
      type: 'Service Reminder'
    });

    if (notif) {
      notif.title = 'Vehicle Service Reminder';
      notif.message = `Next scheduled service for ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) is due in ${diffDays > 0 ? diffDays : 0} days.`;
      notif.daysLeft = diffDays > 0 ? diffDays : 0;
      notif.dueDate = new Date(nextServiceDate);
      notif.isRead = false;
      await notif.save();
    } else {
      await Notification.create({
        userId: req.user.id,
        vehicleId: vehicle._id,
        title: 'Vehicle Service Reminder',
        message: `Next scheduled service for ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) is due in ${diffDays > 0 ? diffDays : 0} days.`,
        type: 'Service Reminder',
        daysLeft: diffDays > 0 ? diffDays : 0,
        dueDate: new Date(nextServiceDate)
      });
    }

    res.status(201).json({
      success: true,
      message: 'Service record added successfully!',
      service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update service record
// @route   PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    let service = await ServiceMaintenance.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service record not found' });
    }

    if (service.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this record' });
    }

    const {
      serviceType,
      serviceDate,
      nextServiceDate,
      mileage,
      cost,
      description,
      serviceCenter,
      status,
      vehicleId
    } = req.body;

    if (serviceType) service.serviceType = serviceType;
    if (serviceDate) service.serviceDate = new Date(serviceDate);
    if (nextServiceDate) service.nextServiceDate = new Date(nextServiceDate);
    if (mileage !== undefined) service.mileage = Number(mileage);
    if (cost !== undefined) service.cost = Number(cost);
    if (description !== undefined) service.description = description.trim();
    if (serviceCenter) service.serviceCenter = serviceCenter.trim();
    if (status) service.status = status;
    if (vehicleId) service.vehicleId = vehicleId;

    await service.save();

    // If nextServiceDate changed, sync notification
    if (nextServiceDate) {
      const vehicle = await Vehicle.findById(service.vehicleId);
      if (vehicle) {
        const diffDays = Math.ceil((new Date(nextServiceDate) - new Date()) / (1000 * 60 * 60 * 24));
        const notif = await Notification.findOne({
          userId: service.userId,
          vehicleId: service.vehicleId,
          type: 'Service Reminder'
        });
        if (notif) {
          notif.message = `Next scheduled service for ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) is due in ${diffDays > 0 ? diffDays : 0} days.`;
          notif.daysLeft = diffDays > 0 ? diffDays : 0;
          notif.dueDate = new Date(nextServiceDate);
          await notif.save();
        }
      }
    }

    res.json({
      success: true,
      message: 'Service record updated successfully!',
      service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete service record
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceMaintenance.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service record not found' });
    }

    if (service.userId.toString() !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this record' });
    }

    const vehicleId = service.vehicleId;
    const userId = service.userId;
    await service.deleteOne();

    // Recompute service reminder for vehicle
    const remainingUpcoming = await ServiceMaintenance.findOne({
      userId,
      vehicleId,
      nextServiceDate: { $gte: new Date() }
    }).sort({ nextServiceDate: 1 });

    const vehicle = await Vehicle.findById(vehicleId);

    if (remainingUpcoming && vehicle) {
      const diffDays = Math.ceil((new Date(remainingUpcoming.nextServiceDate) - new Date()) / (1000 * 60 * 60 * 24));
      await Notification.findOneAndUpdate(
        { userId, vehicleId, type: 'Service Reminder' },
        {
          message: `Next scheduled service for ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}) is due in ${diffDays > 0 ? diffDays : 0} days.`,
          daysLeft: diffDays > 0 ? diffDays : 0,
          dueDate: remainingUpcoming.nextServiceDate
        }
      );
    } else {
      // Remove stale notification if no upcoming services remain
      await Notification.deleteMany({ userId, vehicleId, type: 'Service Reminder' });
    }

    res.json({
      success: true,
      message: 'Service record deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
