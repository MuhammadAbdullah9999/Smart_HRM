function Card({cardText, cardNumber,bgColor}){
    return(
        <div className={`md:w-56 w-40 shadow-lg cursor-pointer p-4 rounded-xl text-white bg-${bgColor} flex flex-col items-center gap-2`}>
            <h1 className="md:text-3xl text-xl font-bold">{cardNumber}</h1>
            <h2 className="md:text-xl  text-sm font-bold">{cardText}</h2>
        </div>
    )
}
export default Card;