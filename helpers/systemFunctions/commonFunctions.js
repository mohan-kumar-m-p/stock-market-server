const uniqueArray = (elemment, index, self = [])=>{
    if(self?.indexOf(elemment)===index){
        return elemment;
    }
}

module.exports = {uniqueArray};