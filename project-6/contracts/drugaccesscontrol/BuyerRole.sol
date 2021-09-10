pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'BuyerRole' to manage this role - add, remove, check
contract BuyerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event BuyerAdded(address indexed account);
  event BuyerRemoved(address indexed account);

  // Define a struct 'Buyers' by inheriting from 'Roles' library, struct Role
  Roles.Role private buyers;

  // In the constructor make the address that deploys this contract the 1st Buyer
  constructor() public {
    _addBuyer(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyBuyer() {
    require(isBuyer(msg.sender), "BuyerRole: caller does not have the Buyer role");
    _;
  }

  // Define a function 'isBuyer' to check this role
  function isBuyer(address account) public view returns (bool) {
    return buyers.has(account);
  }

  // Define a function 'addBuyer' that adds this role
  function addBuyer(address account) public onlyBuyer {
    _addBuyer(account);
  }

  // Define a function 'renounceBuyer' to renounce this role
  function renounceBuyer() public {
    _removeBuyer(msg.sender);
  }

  // Define an internal function '_addBuyer' to add this role, called by 'addBuyer'
  function _addBuyer(address account) internal {
    buyers.add(account);
    emit BuyerAdded(account);
  }

  // Define an internal function '_removeBuyer' to remove this role, called by 'removeBuyer'
  function _removeBuyer(address account) internal {
    buyers.remove(account);
    emit BuyerRemoved(account);
  }
}