App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    var sender = web3.eth.accounts[0];
    var senderRow = $('#senderRow');
    var senderTemplate = $('#senderTemplate');
    senderTemplate.find('.panel-title').text("Current account : " + sender);
    senderRow.append(senderTemplate.html());
    senderRow.append();
    return App.initWeb3();
  },

  initWeb3: function() {
      // Is there is an injected web3 instance?
      if (typeof web3 !== 'undefined') {
	        App.web3Provider = web3.currentProvider;
	        console.log("injection of web3 instance");
      } else {
	        // If no injected web3 instance is detected, fallback to the TestRPC
	        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
          console.log("no injection of web3 instance");
      }
      web3 = new Web3(App.web3Provider);
      return App.initPublisher();
  },

  initPublisher: function() {
    console.log("App.initPublisher");

    $.getJSON('Publisher.json', function(data) {
	  // Get the necessary contract artifact file and instantiate it with truffle-contract
	  var PublisherArtifact = data;
	  App.contracts.Publisher = TruffleContract(PublisherArtifact);
    console.log("TruffleContract");

	  // Set the provider for our contract
	  App.contracts.Publisher.setProvider(App.web3Provider);
	  console.log("Set the provider for our contract");
	  // Use our contract to retrieve and mark the adopted pets
	  return App.initArticles();});
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-add', App.handleCreateArticle);
    $(document).on('click', '.btn-submit', App.handleSubmit);
    $(document).on('click', '.btn-validate', App.handleValidate);
  },

  initArticles: function() {
    var publisherInstance;

    var petsRow = $('#articlesRow');
    var petTemplate = $('#articlesTemplate');
    var addArticleTemplate = $('#addArticleTemplate');

    App.contracts.Publisher.deployed().then(function(instance) {
	  publisherInstance = instance;

    return publisherInstance.getNumSubmitedArticles.call();
  }).then(function(numPublication) {
    //listAuthor = App.getListAuthorArticle(numPublication);
    console.log(numPublication.toString());
    _numPublication = numPublication;

    var p2 = App.asyncLoopOrdered(" ", _numPublication).then(function (result) {

    for(articleId=0;articleId<_numPublication;articleId++){
        //console.log(" " + result.toString());

        var author = result[articleId];
        petTemplate.find('.author').text(author.substring(1,10));
        petTemplate.find('.panel-title').text("Article " + articleId.toString());
        petTemplate.find('img').attr('src', "images/image_2.png");
        petTemplate.find('.btn-submit').attr('data-id', articleId.toString());
        petTemplate.find('.btn-validate').attr('data-id', articleId.toString());
        petsRow.append(petTemplate.html());

        App.getNbReviewers(i);
        App.getStatusArticle(i);
      }
      petsRow.append(addArticleTemplate.html());
      });
    }).catch(function(err) {
	     console.log(err.message);
    });

  },

  getAuthorArticle: function(numArticle){
    return new Promise(function (resolve, reject) {
     setTimeout(function () {
         var output = App.contracts.Publisher.deployed().then(function(instance){ return instance.getAuthorArticle.call(numArticle);});
         resolve(output);
   });
 });
},

   asyncLoopOrdered: function(someInput, times) {
    var iterations = [];
    for (var i = 0; i < times; i++) {
        iterations.push(App.getAuthorArticle(i) );
    }

    return Promise.all(iterations).then(function(output) {
        return output; //add the output all at once when all have completed
    });
  },

  getNumberOfArticles: function(){
    return App.contracts.Publisher.deployed().then(function(instance){ return instance.getNumSubmitedArticles.call();});
  },

  handleCreateArticle: function(event){
    event.preventDefault();
    console.log("handleCreateArticle");
    var publisherInstance;
    web3.eth.getAccounts(function(error, accounts) {
       console.log("handleCreateArticle::getAccount");
        if (error) {
           console.log("handleCreateArticle::getAccount::error");
           console.log(error);
        }
        var account = accounts[0];
        console.log(accounts);

        console.log("handleCreateArticle::Publisher.deployed()");
        App.contracts.Publisher.deployed().then(function(instance) {
  	    publisherInstance = instance;

  	     // Execute adopt as a transaction by sending account
  	     console.log("handleCreateArticle::execute le contract de publication");
  	     return publisherInstance.createArticle.sendTransaction();
     }).then(function(){
        setTimeout(function(){window.location.reload();},5000);
       ;});
   });
 },

  handleValidate: function(event) {
      event.preventDefault();
      console.log("handleValidate");
      var articleId = parseInt($(event.target).data('id'));
      var publisherInstance;
      console.log(articleId);
      web3.eth.getAccounts(function(error, accounts) {
	       console.log("handleValidate::getAccount");
	        if (error) {
	           console.log("handleValidate::getAccount::error");
	           console.log(error);
	        }

      var account = accounts[0];
      console.log(accounts);

      console.log("handleValidate::Publisher.deployed()");
      App.contracts.Publisher.deployed().then(function(instance) {
	    publisherInstance = instance;

	     // Execute adopt as a transaction by sending account
	     console.log("handleValidate::execute le contract de validation");
	     return publisherInstance.validateArticle(articleId);
   }).then(function(result) {
     //on attend un peu le temps de l'execution du contrat
      setTimeout(function(){App.getNbReviewers(articleId);},5000);
      setTimeout(function(){App.getStatusArticle(articleId);},5000);
    }).catch(function(err) {
	     console.log(err.message);
    });
});
},

//HYPO qu'ils sont tous chargés dans le bon ordre
getNbReviewers: function(articleId){
  App.contracts.Publisher.deployed().then(function(instance) {
  publisherInstance = instance;
  return publisherInstance.getValidatedVoteCount.call(articleId);
  }).then(function(result) {
    console.log("UpdateNbReviewers " + articleId + " " + result.toString());
    $('.panel-pet').eq(articleId).find('.nb-reviewers').text(result.toString());
  });
},
getStatusArticle: function(articleId){
  var State = {
  EDITED: 0,
  SUBMITED: 1,
  PENDING: 2,
  VALIDATED: 3,
  };
  App.contracts.Publisher.deployed().then(function(instance) {
  publisherInstance = instance;
  return publisherInstance.getStatusArticle.call(articleId);
  }).then(function(result) {
    if(result.toString()==State.EDITED){
      status = "Draft";
      App.enableSubmitAction(articleId);
      App.disableValidateAction(articleId);
    }
    else{
      if(result.toString() == State.SUBMITED)
      {
        status = "Submited";
        App.disableSubmitAction(articleId);
        App.enableValidateAction(articleId);
        $('.panel-heading').eq(articleId).css('background-color', "#83BEC0");
        $('.panel-pet').eq(articleId).css('border-color', "#83BEC0");
      }
      else {
        if(result.toString() == State.VALIDATED){
          status = "Validated";
          App.disableSubmitAction(articleId);
          App.enableValidateAction(articleId);
          $('.panel-heading').eq(articleId).css('background-color', "MediumSeaGreen");
          $('.panel-pet').eq(articleId).css('border-color', "MediumSeaGreen");
        }
        else{
          status = "Null";
        }
      }
    }
    console.log("getStatusArticle " + articleId + " " + status);
    $('.panel-pet').eq(articleId).find('.status-article').text(status);
    return status;
  });
},

enableSubmitAction: function(articleId){
  $('.panel-pet').eq(articleId).find('button').eq(0).text('Submit').attr('disabled', false);
},
disableSubmitAction: function(articleId){
  $('.panel-pet').eq(articleId).find('button').eq(0).text('Submit').attr('disabled', true);
},
enableValidateAction: function(articleId){
  $('.panel-pet').eq(articleId).find('button').eq(1).text('Validate').attr('disabled', false);
},
disableValidateAction: function(articleId){
  $('.panel-pet').eq(articleId).find('button').eq(1).text('Validate').attr('disabled', true);
},
//
handleSubmit: function(event) {
  event.preventDefault();
  console.log("handleSubmit");
  var articleId = parseInt($(event.target).data('id'));
  var publisherInstance;
  console.log(articleId);
  web3.eth.getAccounts(function(error, accounts) {
  console.log("handleSubmit::getAccount");
  if (error) {
    console.log("handleSubmit::getAccount::error");
    console.log(error);
  }

  var account = accounts[0];
  console.log(accounts);

  console.log("handleSubmit::Publisher.deployed()");
  App.contracts.Publisher.deployed().then(function(instance) {
  publisherInstance = instance;

  // Execute adopt as a transaction by sending account
  console.log("handleSubmit::execute le contract de validation");
  return publisherInstance.submitArticle(articleId);
  }).then(function(result) {
    console.log("handleSubmit : article soumis");
    console.log(result);
    setTimeout(function(){App.getStatusArticle(articleId);},5000);
    }).catch(function(err) {
        console.log(err.message);
      });
  });
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
