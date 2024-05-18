function Location( {url, nameLocation,numDays} ){

    return(
        <div className="data">
            <img className="img" src={url} alt={nameLocation}  />
            <div className="aligment">
                <h3 className="name_location">{nameLocation}</h3>
                <p className="num_day">{numDays} {numDays > 1 ? 'Days' : 'Day'} </p>
            </div>
            {/* <h3 className="name_location">{nameLocation}</h3>
            <p className="num_day">{numDays} {numDays > 1 ? 'Days' : 'Day'} </p> */}
        </div>
    )
}

export default Location