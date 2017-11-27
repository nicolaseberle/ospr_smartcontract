App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../listArticles.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-submit').attr('data-id', data[i].id);
        petTemplate.find('.btn-validate').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

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
      return App.initContract();
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
    $(document).on('click', '.btn-submite', App.handleSubmite);
    $(document).on('click', '.btn-validate', App.handleValidate);
  },

  markValidated: function(adopters, account) {
    var adoptionInstance;

    App.contracts.Publisher.deployed().then(function(instance) {
	  adoptionInstance = instance;

	  return adoptionInstance.getSubmitedArticles.call();
      }).then(function(adopters) {

	  for (i = 0; i < adopters.length; i++) {

	      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
		        console.log("markSubmited");
		  $('.panel-pet').eq(i).find('button').eq(0).text('Submit').attr('disabled', false);
		  $('.panel-pet').eq(i).find('button').eq(1).text('Validate').attr('disabled', true);
	      }
	      else
	      {
		        console.log("markAbandoned");
		  //s'il n'y a pas de proprio, on peut l'adopter
		  $('.panel-pet').eq(i).find('button').eq(0).text('Submited').attr('disabled', true);
		  $('.panel-pet').eq(i).find('button').eq(1).text('Validate').attr('disabled', false);
	      }
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
	return publisherInstance.validateArticle(articleId,{from: account});
    }).then(function(result) {
	console.log("handleValidate : article validé");
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
