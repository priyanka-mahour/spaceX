import React, { useState } from 'react';
import { connect } from "react-redux";
import loaderGif from "../images/loader.gif";
import "../index.css";

function Cards(props) {
    const [page, setPage] = useState(1)
    const { data, showMoreCount, setShowMore, allData, setData, loader } = props;

    const showMore = () => {
        let count = 0;
        let all_data = [...allData]
        if (all_data.length > data.length) {
            setData(all_data.splice(0, ((page + 1) * 20)))
            count = allData.length - ((page + 1) * 20);
            setShowMore(count);
            setPage(page + 1);
        }
    }

    return (
        <div className="flex flexDirection cardWrapper width">
            <div>{loader === false ?
                <>
                    {typeof data != "undefined" && data.map((res, i) => (
                        <div key={i} className="card transition flex justifySpaceBtwn flexDirection">{
                            window.location.href.includes("history") ?
                                <div>{res.title}</div> :
                                <div>{res.payload_id}</div>
                        }</div>
                    ))}
                    {data.length > 0 && showMoreCount > 0 ?
                        <div className="flex alignCenter">
                            <div className="pagination cursorPointer" onClick={showMore}>{`showmore ${showMoreCount}`}</div>
                        </div> :
                        <> {data.length === 0 ? <div className="noData flex alignCenter">No Data Found!!!!!!</div> : <>
                            {typeof allData != "undefined" &&
                                <div className="flex alignCenter">
                                    <div className="pagination">{`Showing ${allData.length} of ${allData.length}`}</div>
                                </div>
                            }
                        </>}
                        </>
                    }
                </> : <div className="noData flex alignCenter"><img className="loader" src={loaderGif} alt="loader" /></div>
            }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        data: state.data,
        allData: state.allData
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setData: (data) => dispatch({ type: "SET_DATA", data }),
        // setPage: (data) => dispatch({ type: "SET_PAGE", data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cards)
