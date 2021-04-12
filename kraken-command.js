
const { kraken } = require('./kraken-api');
const fs = require('fs');

const option = process.argv[2];

// API REQUEST
function Kraken(obj){
    return new Promise( (resolve) => {
        const ticker =  kraken.api(obj.arg1, obj.arg2);    
        resolve(ticker);
    })
};

// UPDATE ASSET
async function updateAssets(obj){

    let asset_pair = {};

    await Kraken(obj)
    .then((res)=>{
        let assets = Object.values(res.result);
        for(let i=0; i<assets.length; i++ ){
            asset_pair[assets[i].wsname] = assets[i].base+assets[i].quote;
        }
    }).catch(err=>console.log(err));

    try{ 
        fs.writeFileSync('./assets.json', JSON.stringify(asset_pair, null, 4) );
        console.log('assets.json updated')
    }
    catch(err){console.log(err)}

}

// CHECK OPTIONS
try{ 

    const assets = JSON.parse(fs.readFileSync('./assets.json'));

    if(option==='-p' || option==='--price-raw'){
        const pair = (process.argv[3]) ? assets[process.argv[3]] : undefined
        obj = { arg1:'Ticker', arg2:{pair:pair} }; 
        Kraken(obj)
        .then((res)=>{
            const current = res.result[pair].c[0]; const low = res.result[pair].l[1]; const high = res.result[pair].h[1];    
            const data = `${process.argv[3]} \ncurrent price: ${current} \nmin last 24h: ${low} \nmax last 24h: ${high}`;
            (option==='--price-raw') ? console.log(res.result[pair]) : console.log(data);
        }).catch(err=>console.log(err))
    }
    else if(option==='-u' || option==='--update'){
        let obj = { arg1:'AssetPairs', arg2:'pair'}
        updateAssets(obj);
    }
    else if(option==='-b'||option==='--balance'){
        Kraken({arg1:'Balance'}).then((res)=>{console.log(res.result);}).catch(err=>console.log(err));
    }
    else if(option==='-o'||option==='--orders'){
        Kraken({arg1:'OpenOrders'}).then((res)=>{console.log(res.result);}).catch(err=>console.log(err));
    }
    else if(option==='-i'||option==='--info-order'){
        const txid = process.argv[3];
        Kraken({arg1:'QueryOrders', arg2:{"txid": txid}}).then((res)=>{console.log(res.result);}).catch(err=>console.log(err));
    }
    else if(option==='-d'||option==='--delete-order'){
        const txid = process.argv[3];
        Kraken({arg1:'CancelOrder', arg2:{"txid": txid}}).then((res)=>{console.log(res.result);}).catch(err=>console.log(err));
    }
    else if(option==='-m' || option==='-l' || option==='--market' || option==='--limit'){

        let ordertype = ''; let price_open = ''; let price_close = '';

        (process.argv[2]==='-m' || process.argv[2]==='--market') ?  ordertype = 'market' : ordertype = 'limit';
        

        (ordertype==='-l'||ordertype==='--limit') ? price_open = process.argv[7] : price_open = '';
        (ordertype==='-l'||ordertype==='--limit') ? price_close = process.argv[8] : price_close = process.argv[7];
        
        const action = process.argv[3]; const pair = assets[process.argv[4]];
        const volume = process.argv[5]; const leverage = process.argv[6];
        
        let obj = {
            arg1:'AddOrder',
            arg2:{
                pair : pair,
                type : action,
                ordertype: ordertype,
                price:price_open,
                volume:volume,
                leverage:leverage,
                close:{
                    ordertype:'limit',
                    price: price_close,
                }        
            }
        }
    
        Kraken(obj).then((res)=>{console.log(res.result);}).catch(err=>console.log(err));

    }
    else{
        console.log('Option error, check --help')
    }

}
catch(err){
    let obj = { arg1:'AssetPairs', arg2:'pair'}; updateAssets(obj);
    console.log('Note: assets.json was missing. Created new one. Try again');
}








