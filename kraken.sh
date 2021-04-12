#!/usr/bin/bash

arguments=();

args=("$@");
n_args=${#args[@]};

for (( i=0;i<$n_args;i++)); do
    arguments+=(${args[${i}]})
done
 

info(){
    echo "Options available:"
    echo "[option] [sell/buy action] [pair from asset.json]"
    echo ""
    echo "-m [buy] [XBT/EUR] [volume] [leverage] [priceClose]                              set order sell or buy with open market price and limit closing price"
    echo "-l [sell] [XBT/EUR] [volume] [leverage] [priceOpen] [priceClose]                 set order sell or buy with limit open price and closing price"
    echo "-p [XBT/EUR]                                                                     current price and last min,max 24h prices"
    echo "-b                                                                               balance available"
    echo "-o                                                                               list all txid open orders"
    echo "-i [txid]                                                                        get order info from txid"
    echo "-d [txid]                                                                        delete an order from txid"
}


if [[ -z $1 ]] || [[ $1 == "-h" ]] || [[ $1 == "--help" ]]; then
    info
else
    node "./kraken_modules/kraken-command.js" ${arguments[@]}
fi
