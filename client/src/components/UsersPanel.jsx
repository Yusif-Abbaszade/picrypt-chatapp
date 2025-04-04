import { useState } from "react";
import { IconContext } from "react-icons"
import { FaUser } from "react-icons/fa"
import { PiUsersFill } from "react-icons/pi";

const UsersPanel = ({ setIsChatContainerOpen, allUsers, setSelectedUser, signOut, session }) => {

    const [searchUserText, setSearchUserText] = useState('');

    const setSelectedClass = (id) => {
        const allUsers = document.querySelectorAll('.all-users div');
        allUsers.forEach((user) => {
            user.classList.remove('selected');
        })
        document.getElementById(id).classList.add('selected');
    }
    return (
        <div style={{ minWidth: "250px", width: "20%", height: "100vh", backgroundColor: "#E8F1F2" }} className="userspanel-sec d-flex flex-column p-3">
            <span style={{fontSize:"12px"}}>{session?.user?.email?.substring(0, 30)}</span>
            <button className="btn btn-danger w-100 fw-bold fs-5 mt-2 mb-3" onClick={signOut}>EXIT</button>
            <input onChange={(e)=>{setSearchUserText(e.target.value)}} type="text" placeholder="Search..." style={{ background: "none", backgroundColor: "#C6E3FA", width: "100%" }} className="rounded-3 py-2" />
            <div className="d-flex flex-column gap-3 mt-4 all-users" style={{overflowY: "scroll"}}>
                <div className="d-flex flex-row align-items-center mb-2 py-2 selected" onClick={() => { setIsChatContainerOpen(true); setSelectedClass('public'); setSelectedUser('public') }} id={'public'} style={{ cursor: "pointer", width: "100%", height: "50px", backgroundColor: "#FFF", borderRadius: "10px" }}>
                    <IconContext.Provider value={{ color: "#626262", size: "2em", className: "rounded-5 border-dark" }}>
                        <PiUsersFill />
                    </IconContext.Provider>
                    <span className="fs-5 ps-2">All</span>
                </div>
                {allUsers.filter(item=>item.email.toLowerCase().includes(searchUserText.toLowerCase())).map((item, index) => (
                    <div key={index} className="d-flex flex-row align-items-center mb-2 py-2" onClick={() => { setIsChatContainerOpen(true); setSelectedClass(item.id); setSelectedUser(item.email) }} id={item.id} style={{ cursor: "pointer", width: "100%", height: "50px", backgroundColor: "#FFF", borderRadius: "10px" }}>
                        <IconContext.Provider value={{ color: "#626262", size: "2em", className: "rounded-5 border-dark" }}>
                            <FaUser />
                        </IconContext.Provider>
                        <span className="ps-2" style={{fontSize:"12px"}}>{item.email.substring(0,24)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UsersPanel