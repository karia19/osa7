
const dummy = (blogs) => {
    return 1;
}
const totalLikes = (blogs) => {
    const tulos =  blogs.map(x => x.likes).reduce((x, y) => x + y,0)
    return tulos;
}
const favoriteBlog = (blogs) => {
   
    const blogLikes = blogs.map(x => x.likes)
    const blogMaxNum = Math.max(...blogLikes)
    const blogMax = blogs.filter(x => x.likes === blogMaxNum )
    
    return blogMax;

}


module.exports = {
     dummy, totalLikes, favoriteBlog
   
}