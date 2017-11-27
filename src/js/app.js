App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    /*
    $.getJSON('../listArticles.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-edited').attr('data-id', data[i].id);
        petTemplate.find('.btn-submit').attr('data-id', data[i].id);
        petTemplate.find('.btn-validate').attr('data-id', data[i].id);
        petsRow.append(petTemplate.html());
      }
    });
    */
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
	  return App.markValidated();});
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-submite', App.handleSubmit);
    $(document).on('click', '.btn-validate', App.handleValidate);
  },

  markValidated: function(adopters, account) {
    var publisherInstance;

    App.contracts.Publisher.deployed().then(function(instance) {
	  publisherInstance = instance;

	  return publisherInstance.getNumSubmitedArticles.call();
  }).then(function(numPublication) {

    var petsRow = $('#petsRow');
    var petTemplate = $('#petTemplate');

    for (i = 0; i <= numPublication.toString(); i++) {






        petTemplate.find('.panel-title').text("Article " + i.toString());
        petTemplate.find('img').attr('src', "images/image_2.png");
        petsRow.append(petTemplate.html());



      //$('.panel-pet').eq(i).find('button').eq(0).text('Edited').attr('disabled', false);
      //$('.panel-pet').eq(i).find('button').eq(1).text('Submit').attr('disabled', false);
		  //$('.panel-pet').eq(i).find('button').eq(2).text('Validate').attr('disabled', false);

	    }
    }).catch(function(err) {
	     console.log(err.message);
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
	console.log("handleValidate : article validé");
	console.log(result);
	return App.markValidated();
    }).catch(function(err) {
	console.log(err.message);
    });
});
},




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
  return publisherInstance.submitArticle();
  }).then(function(result) {
    console.log("handleSubmit : article soumis");
    console.log(result);
    return App.markValidated();
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
