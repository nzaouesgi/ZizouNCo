// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

contract RealEstateMarketContract {

  struct Document {
    uint id;
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
    uint[] memory _documentIds,
    bytes32[] memory _documentHashes
    ) public {

      require(_documentIds.length == _documentHashes.length);

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

      for (uint i=0; i< _documentIds.length; i++) {
        documents.push(
          Document(_documentIds[i], _documentHashes[i])
        );
        propertyToDocuments[propertyId].push(documents.length - 1);
      }
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

  function countProperties() public returns (uint) {

    return properties.length;
  }

  /*function getPropertiesData () external view returns (Property [100] memory){
    
    Property[100] memory _p;

    return _p;
  }

  function getPropertyData (uint _id) external view 
    returns (
      string memory description, 
      string memory location,
      uint price,
      address ownerAddress,
      bool forSale,
      uint createdAt
    ) {

    Property storage p = properties[_id];
    
    return (
      p.description, 
      p.location,
      p.price,
      p.ownerAddress,
      p.forSale,
      p.createdAt
    );
  }*/
}
