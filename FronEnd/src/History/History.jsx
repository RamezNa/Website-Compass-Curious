import './history.css'
import Location from './component/Location'

function History(){
return(
    <div className="history">
        <div className='header'>
            <div className='line'></div>
            <h1 className='title'>History</h1>
        </div>
        <h2 className='subTitle'>Continue planning your dream trip!<br/>Access your saved itineraries for inspiration.</h2>
        <div className='line'></div>
        <div className="container_data">
            <Location url={'https://www.state.gov/wp-content/uploads/2023/07/shutterstock_245773270v2.jpg'} nameLocation={'China'} numDays={4} />
            <Location url={'https://images.unsplash.com/photo-1587297069400-6cc5da81658a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} nameLocation={'jerusalem'} numDays={1} />
            <Location url={'https://www.state.gov/wp-content/uploads/2023/07/shutterstock_245773270v2.jpg'} nameLocation={'China'} numDays={4} />
            <Location url={'https://images.unsplash.com/photo-1587297069400-6cc5da81658a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} nameLocation={'jerusalem'} numDays={1} />
            <Location url={'https://www.state.gov/wp-content/uploads/2023/07/shutterstock_245773270v2.jpg'} nameLocation={'China'} numDays={4} />
            <Location url={'https://images.unsplash.com/photo-1587297069400-6cc5da81658a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} nameLocation={'jerusalem'} numDays={1} />
            <Location url={'https://images.unsplash.com/photo-1587297069400-6cc5da81658a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} nameLocation={'jerusalem'} numDays={1} />
        </div>
    </div>
)
}

export default History