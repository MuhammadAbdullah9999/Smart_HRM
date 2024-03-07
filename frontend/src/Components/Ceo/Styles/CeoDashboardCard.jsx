function Card({cardText, cardNumber,bgColor}){
    return(
        <div className={`w-[23%] shadow-lg cursor-pointer p-4 rounded-xl text-white bg-${bgColor} flex flex-col items-center gap-2`}>
            <h1 className="text-3xl font-bold">{cardNumber}</h1>
            <h2 className="text-xl font-bold">{cardText}</h2>
        </div>
    )
}
export default Card;