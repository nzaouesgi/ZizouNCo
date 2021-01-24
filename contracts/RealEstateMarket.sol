// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract RealEstateMarket {

  struct Document {
    string identifier;
    bytes32 integrity;
  }
  
  struct Property {
    uint price;
    string location;
    string description;
    address payable ownerAddress;
    bool forSale;
    uint createdAt;
  }

  address public owner;

  Property [] public properties;
  Document[] public documents;
  
  mapping (address => uint[]) public ownerToProperties;
  mapping (uint => uint[]) public propertyToDocuments;
  
  uint public propertiesForSale;

  constructor () public {
    owner = msg.sender;
    propertiesForSale = 0;
  }

  function time() view internal returns (uint){
      return now;
  }

  function addProperty (
    uint _price, 
    string memory _location,
    string memory _description,
    string[] memory _documentIdentifiers,
    bytes32[] memory _documentHashes
    ) public {

      require(_documentIdentifiers.length == _documentHashes.length);

      properties.push(
        Property(
          _price, 
          _location, 
          _description, 
          msg.sender, 
          true,
          time()
        )
      );
      
      uint propertyId = properties.length - 1;
      ownerToProperties[msg.sender].push(propertyId);

      for (uint i=0; i< _documentIdentifiers.length; i++) {
        documents.push(
          Document(_documentIdentifiers[i], _documentHashes[i])
        );
        propertyToDocuments[propertyId].push(documents.length - 1);
      }
  }

  function getPropertyDocuments(uint propertyIndex) external view returns (Document[] memory propertyDocuments) {
    require(propertyIndex < properties.length);

    uint[] memory _items = propertyToDocuments[propertyIndex];
    Document[] memory _propertyDocuments = new Document[](_items.length);

    for(uint i = 0; i < _items.length; i++){
      _propertyDocuments[i] = documents[_items[i]];
    }
    
    return (_propertyDocuments);
  }
  
  function buyProperty (uint _id) external payable {

    require(_id < properties.length);

    for (uint i = 0; i < ownerToProperties[msg.sender].length; i ++){
      require(ownerToProperties[msg.sender][i] != _id);
    }

    Property storage _p = properties[_id];

    require(_p.forSale == true);

    require(msg.value == _p.price);

    _p.ownerAddress.transfer(msg.value);

    for (uint i = 0; i < ownerToProperties[_p.ownerAddress].length; i ++){
      if (ownerToProperties[_p.ownerAddress][i] == _id){
        delete ownerToProperties[_p.ownerAddress][i];
      }
    }

    _p.ownerAddress = msg.sender;
    _p.forSale = false;

    ownerToProperties[msg.sender].push(_id);
  }

  uint constant itemsPerPage = 25;

  function paginateProperties (uint _page) external view 
    returns (Property[itemsPerPage] memory items, uint itemsCount, uint itemsTotal) {
    
    Property[itemsPerPage] memory _items;

    uint _itemsCount = 0;

    for (uint i = _page * itemsPerPage; i < itemsPerPage + (_page * itemsPerPage); i ++){
      if (i < properties.length){
        _items[_itemsCount] = properties[i];
        _itemsCount++;
      }
    }

    return (_items, _itemsCount, properties.length);
  }
}
