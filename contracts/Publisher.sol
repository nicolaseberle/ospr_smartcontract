pragma solidity ^0.4.0;
contract Publisher{

    enum State {edited,submited,pending, validated}

    struct Reviewer {
    	address addr;
      bool voted;
    }
    //Validation is the sum of positive and negative vote of the article
    struct Publication {
      address author;
	    uint creationDate;
	    uint numReviewers;
     	State state;
	    uint validatedVoteCount;
      uint rejectedVoteCount;
	    mapping(address => Reviewer) reviewers;
	  }

    uint numPublications;
    mapping(uint => Publication) publications;

    /// Create a new publication with hashcontent of the document.
    function createArticle() public returns(uint publicationID){
      publicationID = numPublications ++;
      publications[publicationID] = Publication(msg.sender,now,0,State.edited,0,0 );
      return publicationID;
    }


    function submitArticle(uint publicationID) public{
      Publication storage paper = publications[publicationID];
      require(paper.author==msg.sender);
      paper.state = State.submited;
    }

    function getNumSubmitedArticles() public constant returns(uint){
      return numPublications;
    }

    function validateArticle(uint publicationID) public returns(uint){
      Publication storage paper = publications[publicationID];
	    Reviewer storage sender = paper.reviewers[msg.sender];
      if (sender.voted || paper.author==msg.sender ) return 0;
	    paper.reviewers[msg.sender] = Reviewer({addr: msg.sender,voted:true});
      paper.numReviewers++;
	    paper.validatedVoteCount++;

	    if(paper.validatedVoteCount>=3){
        paper.state = State.validated;
	    }
      return 1;
    }

    function rejectArticle(uint publicationID) public{
      Publication storage paper = publications[publicationID];
	    Reviewer storage sender = paper.reviewers[msg.sender];
      if (sender.voted || paper.author==msg.sender ) return;
	    paper.reviewers[msg.sender] = Reviewer({addr: msg.sender,voted:true});
      paper.numReviewers++;
	    paper.rejectedVoteCount++;

    }

    function getValidatedVoteCount(uint publicationID) public constant returns(uint){
      Publication storage paper = publications[publicationID];
      return paper.validatedVoteCount;
    }

    function getStatusArticle(uint publicationID) public constant returns(State){
      Publication storage paper = publications[publicationID];
      return paper.state;
    }

    function getAuthorArticle(uint publicationID) public constant returns(address){
      Publication storage paper = publications[publicationID];
      return paper.author;
    }
    function getNumberOfReviewers(uint publicationID) public returns(uint){
      Publication storage paper = publications[publicationID];
      return paper.numReviewers;
    }
}
