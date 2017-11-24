# ospr_smartcontract


## Installation

```bash
mkdir rep_travail
cd rep_travail
```

## RUN
### Initialisation of ethermint and tendermint


```bash
rm -rf ~/.ethermint
ethermint --datadir ~/.ethermint_ospr init genesis.json
tendermint init --home ~/.ethermint_ospr/tendermint
```
genesis.json is necessary to init the VM.

### Some keys

You can optionally copy a keystore to the Ethereum folder that you used in the steps above i.e `~/.ethermint` e.g

```bash
cp -r keystore ~/.ethermint_ospr
```

### Warning
If tendermint exists, you have to clean the database and the logfile

```bash
tendermint unsafe_reset_all
```

## Running
In the first shell, launch ethermint:

```bash
ethermint --datadir ~/.ethermint_ospr --rpc --rpcaddr=0.0.0.0 --ws --wsaddr=0.0.0.0 --rpccorsdomain "*" --rpcapi eth,net,web3,personal,admin -unlock 0x7eff122b94897ea5b0e2a9abf47b86337fafebdc
```

* Note:
In order to use the address "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc" we have to unlock it (to avoid to type the passphrase...).  The **password** for the default account is *1234*.


In a second shell, launch tendermint
```bash
tendermint  --home ~/.ethermint_ospr/tendermint node
```
In a third shell, launch the lite client:

```bash
npm run dev
```
## Troubles ?

Check firstly your firewall

### Firewall
The firewall can block some ports. 

```bash
sudo iptables -L
```

You can find a generic firewall source which can be used to initialize your firewall

```bash
sudo firewall.init
```

//TO DO mettre ce fichier source qq part






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

