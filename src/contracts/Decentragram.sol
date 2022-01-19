pragma solidity ^0.5.0;

contract Decentragram {
    string public name = 'Decentragram';

    //Store the posts
    uint public imageCount = 0;
    mapping (uint => Image) public images;
    struct Image{
      uint id;
      string hash;
      string description;
      uint tipAmount;
      address payable author;
    }
    event ImageCreated(
      uint id,
      string hash,
      string description,
      uint tipAmount,
      address payable author
    );
    event ImageTipped(
      uint id,
      string hash,
      string description,
      uint tipAmount,
      address payable author
    );
    
    
    //Create image

    function uploadImage(string memory _imgHash, string memory _description) public {
      require(bytes(_imgHash).length > 0);       //making sure the image is not blank   
      require(bytes(_description).length > 0);   //making sure the image has a description
      require(msg.sender != address(0x0));         //making sure the address is not blank
      //increment imageid
      imageCount++;
      images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);
      //trigger event
      emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
    }
    
    function tipImageOwner(uint _id) public payable {
      require(_id > 0 && _id <= imageCount);
      Image memory _image = images[_id];         //fetch the image
      address payable _author = _image.author;   //fetch the author
      address (_author).transfer(msg.value);     //pay the author
      _image.tipAmount = _image.tipAmount + msg.value;                //imcrementing the amount paid 

      emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
    }
    
}