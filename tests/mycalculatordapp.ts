
import assert from 'assert';
import * as anchor from '@project-serum/anchor';
import {AnchorProvider, web3} from '@project-serum/anchor';
const {SystemProgram} = web3;

describe ('mycalculatordapp', () => {
    const provider = AnchorProvider.local();
    anchor.setProvider(provider)
    const calculator = anchor.web3.Keypair.generate()
    const program = anchor.workspace.Mycalculatordapp

    it('Creates a calculator', async () => {
        await program.rpc.create("Welcome to SOL calculator", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.greeting === "Welcome to SOL calculator")
    })

    it('Adds two numbers',async () => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(4), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result.eq(new anchor.BN(6)))
    })

    it('Subtracts two numbers',async () => {
        await program.rpc.sub(new anchor.BN(6), new anchor.BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result1.eq(new anchor.BN(4)))
    })

    it('Multiplies two numbers',async () => {
        await program.rpc.multi(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result2.eq(new anchor.BN(6)))
    })

    it('Divides two numbers',async () => {
        await program.rpc.divide(new anchor.BN(10), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        })
        const account = await program.account.calculator.fetch(calculator.publicKey)
        assert.ok(account.result3.eq(new anchor.BN(3)))
        assert.ok(account.reminder.eq(new anchor.BN(1)))
    })

})