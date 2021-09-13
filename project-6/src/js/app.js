
const App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x1E11227Ffd4ddD9EABbBB0339eB0e923466F7dC9",
    originManufacturerID: "0x1E11227Ffd4ddD9EABbBB0339eB0e923466F7dC9",
    originManufacturerName: null,
    originManufacturerInformation: null,
    originManufacturerLatitude: null,
    originManufacturerLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x805F66440a669EfEe0C38cCCaA20F555211A9CB9",
    inspectorID: "0x59ca5Bad80Ac2b77DdebC6D5d5a79628123a270e",
    buyerID: "0xDCcdC56e19Cc7546Ac23Da69cd68194DA1B049Fc",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originManufacturerID = $("#originManufacturerID").val();
        App.originManufacturerName = $("#originManufacturerName").val();
        App.originManufacturerInformation = $("#originManufacturerInformation").val();
        App.originManufacturerLatitude = $("#originManufacturerLatitude").val();
        App.originManufacturerLongitude = $("#originManufacturerLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.inspectorID = $("#inspectorID").val();
        App.buyerID = $("#buyerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originManufacturerID, 
            App.originManufacturerName, 
            App.originManufacturerInformation, 
            App.originManufacturerLatitude, 
            App.originManufacturerLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.inspectorID, 
            App.buyerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum !== 'undefined') {
            App.web3Provider = new Web3(window.ethereum);
            try {
                // Request account access
                ethereum.request({ method: 'eth_requestAccounts' });;
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider.currentProvider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

            // App.contracts.SupplyChain.deployed().then(function(instance) {
            //     instance.addBuyer(buyerID, { from: ownerID });
            //     instance.addInspector(inspectorID, { from: ownerID });
            //     instance.addDistributor(distributorID, { from: ownerID });
            //     instance.addManufacturer(buyerID, { from: ownerID });
            // })

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.createDrug(event);
                break;
            case 2:
                return await App.packDrug(event);
                break;
            case 3:
                return await App.tagDrug(event);
                break;
            case 4:
                return await App.auditDrug(event);
                break;
            case 5:
                return await App.buyDrug(event);
                break;
            case 6:
                return await App.distributeDrug(event);
                break;
            case 7:
                return await App.addInspector(event);
                break;
            case 8:
                return await App.addDistributor(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.addBuyer(event);
                break;
            case 12:
                return await App.addManufacturer(event);
                break;
            }
    },

    createDrug: function(event) {
        event.preventDefault();
        this.readForm()
        var processId = parseInt($(event.target).data('id'));
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.createDrug(
                App.upc, 
                App.metamaskAccountID, 
                App.originManufacturerName, 
                App.originManufacturerInformation,
                App.originManufacturerLatitude,
                App.originManufacturerLongitude,
                App.productNotes,
                {from:  App.metamaskAccountID }
            );
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('createDrug',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    packDrug: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packDrug(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('packDrug',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    tagDrug: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.tagDrug(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('tagDrug',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    auditDrug: function (event) {
        event.preventDefault();
        this.readForm()
        var processId = parseInt($(event.target).data('id'));
        console.log(App.ownerID)
        App.contracts.SupplyChain.deployed().then(function(instance) {
            //return  instance.addInspector(App.inspectorID, { from: App.metamaskAccountID });
            return instance.auditDrug(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('auditDrug',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyDrug: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.utils.toWei("3", "ether");
            return instance.buyDrug(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    distributeDrug: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.distributeDrug(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('distributeDrug',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function (event) {
        event.preventDefault();
        var processId = parseInt($(event.target).data('id'));

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function (event) {
        // event.preventDefault();
        // var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }
        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        }); 
        }).catch(function(err) {
          console.log(err.message);
        });
        
    },


    addManufacturer: function () {
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return  instance.addManufacturer(App.originManufacturerID, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addDistributor',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
     
    addInspector: function () {
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return  instance.addInspector(App.inspectorID, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addInspector',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addBuyer: function () {
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return  instance.addBuyer(App.buyerID, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addBuyer',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addDistributor: function () {
        this.readForm()
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return  instance.addDistributor(App.distributorID, { from: App.metamaskAccountID });
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('addDistributor',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    }
};

window.App = App;


$(function () {
    $(window).load(function () {
        App.init();
    });
});
