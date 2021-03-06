// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions');

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originManufacturerID = accounts[1]
    const originManufacturerName = "John Doe"
    const originManufacturerInformation = "Yarray Valley"
    const originManufacturerLatitude = "-38.239770"
    const originManufacturerLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Formula: C16H18N2O4S - Metabolism: hepatic"
    const productPrice = web3.utils.toWei('1', "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const buyerID = accounts[4]
    const inspectorID = accounts[3]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    
    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Manufacturer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Inspector: accounts[3] ", accounts[3])
    console.log("Buyer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function CreateDrug() that allows a manufacturer to create a drug", async() => {
        const supplyChain = await SupplyChain.deployed()
        await supplyChain.addBuyer(buyerID, { from: ownerID });
        await supplyChain.addInspector(inspectorID, { from: ownerID });
        await supplyChain.addDistributor(distributorID, { from: ownerID });
        await supplyChain.addManufacturer(originManufacturerID, { from: ownerID });

    
        // Mark a drug as Created by calling function dreateDrug()
        let drug = await supplyChain.createDrug(upc, originManufacturerID, originManufacturerName, originManufacturerInformation, originManufacturerLatitude, originManufacturerLongitude, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        truffleAssert.eventEmitted(drug, 'Created');
    })    

    // 2nd Test
    it("Testing smart contract function packDrug() that allows a manufacturer to create a drug", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let upc = 1
        let price = 26

        // Mark an item as Packed by calling function packDrug()
        let drug = await supplyChain.packDrug(upc, price)
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')  
        //  emitted event Packed()   
        truffleAssert.eventEmitted(drug, 'Packed');
    })    

    // 3rd Test
    it("Testing smart contract function tagDrug() that allows a manufacturer to tag a  drug", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let upc = 1
        
        // Watch the 
        

        // Mark an item as Packed by calling function tagDrug()
        let drug = await supplyChain.tagDrug(upc)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')  
        // emitted event Tagged()
        truffleAssert.eventEmitted(drug, 'Tagged');
    })    

    // 4th Test
    it("Testing smart contract function auditDrug() that allows an inspector to audit a drug", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let upc = 1
        
        // Mark an item as Audited by calling function auditDrug()
        let drug = await supplyChain.auditDrug(upc, { from: inspectorID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], inspectorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[8], inspectorID, 'Error: Missing or Invalid inspectorID')  
        // emitted event Audited()
        truffleAssert.eventEmitted(drug, 'Audited')
          
    })    

    // 5th Test
    it("Testing smart contract function distributeDrug() that allows a distributor to mark an drug for sale", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let upc = 1
        
        // Mark an item ForSale by calling function distributeDrug()
        let drug = await supplyChain.distributeDrug(upc, { from: distributorID})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[7], distributorID, 'Error: Missing or Invalid distributorID')  
        // emitted event ForSale()
        truffleAssert.eventEmitted(drug, 'ForSale')
    })    

    // 6th Test
    it("Testing smart contract function buyItem() that allows a buyer to buy a drug", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        let upc = 1
        let res1 = await supplyChain.fetchItemBufferTwo.call(upc)
        // Mark an item Sold by calling function buyDrug()
        let drug = await supplyChain.buyDrug(upc, { from: buyerID, value: res1.productPrice})
        
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], buyerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferTwo[9], buyerID, 'Error: Missing or Invalid buyerID')  
        // emitted event Sold()
        truffleAssert.eventEmitted(drug, 'Sold')
    })    

    
    // 7th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()
        let upc = 1
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
    })

    // 8th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()
        let upc = 1
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const fetchItemBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(fetchItemBufferTwo[1], upc, 'Error: Invalid item UPC')
    })

});

