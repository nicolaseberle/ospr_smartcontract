


mkdir rep_travail
cd rep_travail

//init d ethermint et tendermint
rm -rf ~/.ethermint
ethermint --datadir ~/.ethermint_ospr init ../myApp/genesis.json
tendermint init --home ~/.ethermint_ospr/tendermint
cp -r keystore ~/.ethermint_ospr

//Si tendermint existe
tendermint unsafe_reset_all


//Dans un permier terminal (T1)
ethermint --datadir ~/.ethermint_ospr --rpc --rpcaddr=0.0.0.0 --ws --wsaddr=0.0.0.0 --rpccorsdomain "*" --rpcapi eth,net,web3,personal,admin -unlock 0x7eff122b94897ea5b0e2a9abf47b86337fafebdc
//passephrase : 1234


//Dans un deuxième terminal (T2)
tendermint  --home ~/.ethermint_ospr/tendermint node

//Dans un troisième terminal (T3)
npm run dev





/********************************************************************/
genesis.json
/********************************************************************/
{
    "alloc": {
        "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc": {
            "balance": "10000000000000000000000000000000000"
        },
        "0xc6713982649D9284ff56c32655a9ECcCDA78422A": {
            "balance": "10000000000000000000000000000000000"
        }
    },
    "config": {
        "chainId": 15,
        "eip155Block": 0,
        "eip158Block": 0,
        "homesteadBlock": 0
    },
    "difficulty": "0x40",
    "gasLimit": "0x8000000",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "nonce": "0xdeadbeefdeadbeef",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
}

/********************************************************************/
