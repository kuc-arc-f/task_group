const LibTodo = {
  replaceMutaionString: function(value){
    try{
      let contentValue = value;
      contentValue = contentValue.replace(/\r?\n/g, '<br />');  //win
      contentValue = contentValue.replace(/\n/g, '<br />');
      contentValue = contentValue.replace(/\"/g, '<doubleQuarts>');      
      return contentValue;
    } catch (e) {
      console.log(e);
      throw new Error('error, test1');
    }
  },
}
export default LibTodo
