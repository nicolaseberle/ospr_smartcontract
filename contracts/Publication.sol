pragma solidity ^0.4.0;
contract Publication {

    struct Reviewer {
        bool voted;
        uint8 vote;
        uint weight;
    }
    //Validation is the sum of positive and negative vote of the article
    struct Validation {
        uint validatedVoteCount;
        uint rejectedVoteCount;
    }

    address author;
    // hashcontent of the original article
    // hashcontent can be modified during the reviewing phase
    address hashcontent;
    bytes32  title;
    uint creationDate;
    uint validationDate;
    
    Validation public validation;
    
    //reviewers is the set of reviewers
    mapping(address => Reviewer) public reviewers;
    
    //State is the state of the publication
    enum State {submited, pending, validated}
    State public state;
    
    /// Create a new publication with hashcontent of the document.
    function Publication() public {
        author = msg.sender;
        //hashcontent = _hashcontent;
        state = State.submited;
        validation.validatedVoteCount = 0;
        validation.rejectedVoteCount = 0;
        creationDate = now;
    }
    
    //During reviewing proccess, the author can update the article
    function UpdateHashcontent() public view{
        //user has to be the author and article status has to be "pending"
        if (msg.sender == author && state == State.pending)
        {
            // TO DO calculate hashcontent of the updated document
        }
    }

    /// Give $(reviewer) the right to vote on this publication
    /// May only be called by $(chairperson).
    //function giveRightToReview(address reviewer) private{
    //    if (msg.sender != author || reviewers[reviewer].voted) return;
    //    reviewers[reviewer].weight = 1;
    //}

    /// Give a single vote to validation $(validation). yes or no
    function validateArticle() public{
        Reviewer storage sender = reviewers[msg.sender];
        if (sender.voted ) return;
        sender.voted = true;
        sender.vote = 1;
        validation.validatedVoteCount += 1;
        
    }
    
    function rejectArticle() public{
        Reviewer storage sender = reviewers[msg.sender];
        if (sender.voted) return;
        sender.voted = true;
        sender.vote = 0;
        validation.rejectedVoteCount += 1;
    }
    function getCreationDate() public constant returns(uint){
        return creationDate;
    }
    
    function getValidatedVoteCount() public constant returns(uint){
        return validation.validatedVoteCount;
    }
    function getStatusArticle() public constant returns(State){
        return state;
    }
    function getSender() public constant returns(address){
        return msg.sender;
    }
    function getAuthor() public constant returns(address){
        return author;
    }
}














