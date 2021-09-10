pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";


contract ManufacturerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event ManufacturerAdded(address indexed account);
  event ManufacturerRemoved(address indexed account);
  // Define a struct 'consumers' by inheriting from 'Roles' library, struct Role
  Roles.Role private _manufacturers;
  // In the constructor make the address that deploys this contract the 1st manufacturer
  constructor() public {
     _addManufacturer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyManufacturer() {
    require(isManufacturer(msg.sender), "ManufacturerRole: caller does not have the Manufacturer role");
    _;
  }

  // Define a function 'isManufacturer' to check this role
  function isManufacturer(address account) public view returns (bool) {
    return _manufacturers.has(account);
  }

  // Define a function 'addManufacturer' that adds this role
  function addManufacturer(address account) public onlyManufacturer {
    _addManufacturer(account);
  }

  // Define a function 'renounceManufacturer' to renounce this role
  function renounceManufacturer() public {
    _removeManufacturer(msg.sender);
  }

  // Define an internal function '_addManufacturer' to add this role, called by 'addManufacturer'
  function _addManufacturer(address account) internal {
    _manufacturers.add(account);
    emit ManufacturerAdded(account);
  }

  // Define an internal function '_removeManufacturer' to remove this role, called by 'removeManufacturer'
  function _removeManufacturer(address account) internal {
    _manufacturers.remove(account);(account);
    emit ManufacturerRemoved(account);
  }
}