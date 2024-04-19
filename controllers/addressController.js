import Address from './../models/addressModel.js';
import User from './../models/userModel.js';
import { catchAsync } from './../utils/catchAsync.js';

export const getSavedAddressesByUser = catchAsync(async (req, res) => {
  const userWithAddresses = await User.findById(req.user.id).populate(
    'savedAddresses'
  );
  const addresses = userWithAddresses.savedAddresses;

  res.status(200).json({
    status: 'success',
    results: addresses.length,
    data: {
      addresses,
    },
  });
});

export const addSavedAddressToUser = catchAsync(async (req, res) => {
  console.log(req.user);
  const addressToAdd = { ...req.body, user: req.user.id };

  //Create the new address in the database
  const newAddress = await Address.create(addressToAdd);

  //Update the user to store the id of the created address
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { savedAddresses: newAddress._id },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: {
      newAddress,
    },
  });
});

export const deleteAddressFromUser = catchAsync(async (req, res) => {
  console.log(req.params.id);

  const response = await Address.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Address deleted successfully',
  });
});
