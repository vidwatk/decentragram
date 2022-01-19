const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Decentragram', ([deployer, author, tipper]) => {
    let decentragram

    before(async() => {
        decentragram = await Decentragram.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = await decentragram.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async() => {
            const name = await decentragram.name()
            assert.equal(name, 'Decentragram')
        })
    })

    describe('images', async() => {
        let result, imageCount
        const hash = 'goodbye world'

        before(async() => {
            result = await decentragram.uploadImage(hash, 'Image description', { from: author })
            imageCount = await decentragram.imageCount();
        })

        it('create images', async() => {

            //Successful upload
            assert.equal(imageCount, 1)
                //console.log(result)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is perf')
            assert.equal(event.description, 'Image description', 'desc is correct')
            assert.equal(event.tipAmount, '0', 'even that is correct')
            assert.equal(event.author, author, 'author is kind of a bitch')

            await decentragram.uploadImage('', 'Image description', { from: author }).should.be.rejected;
            await decentragram.uploadImage('Image hash', '', { from: author }).should.be.rejected;


        })
        it('lists images', async() => {
            const image = await decentragram.images(imageCount)
            assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(image.hash, hash, 'Hash is perf')
            assert.equal(image.description, 'Image description', 'desc is correct')
            assert.equal(image.tipAmount, '0', 'even that is correct')
            assert.equal(image.author, author, 'author is kind of a bitch')
        })

        it('allows users to tip images', async() => {
            // Track the author balance before purchase
            let oldAuthorBalance
            oldAuthorBalance = await web3.eth.getBalance(author)
            oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

            result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

            // SUCCESSFULL Trans
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.description, 'Image description', 'description is correct')
            assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')
        })
    })
})