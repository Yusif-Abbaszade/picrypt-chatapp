import { useEffect, useState } from "react"
import { IconContext } from "react-icons"
import { FaUser } from "react-icons/fa"
import { IoArrowBackCircle, IoSend } from "react-icons/io5"

const ChatContainer = ({ isSmallDevice, setIsSmallDevice, setIsChatContainerOpen, messages, addMessage, setNewMessage, session, selectedUser }) => {

    useEffect(() => {
        if (window.innerWidth <= 550) {
            setIsSmallDevice(true);
        } else {
            setIsSmallDevice(false);
        }
        window.addEventListener("resize", () => {
            if (window.innerWidth <= 550) {
                setIsSmallDevice(true);
            } else {
                setIsSmallDevice(false);
            }
        });
    }, [])

    useEffect(() => {
        if (session) {
            document.querySelector('.messages-sec').scrollTop = document.querySelector('.messages-sec').scrollHeight;
        }
    }, [messages])

    return (
        <div className="chatcontainer-sec" style={{ width: "80%", height: "100vh", backgroundColor: "#FFF", position: "relative", overflowY: "hidden" }}>
            <button className={`btn ${isSmallDevice ? "" : "d-none"}`} onClick={() => { setIsChatContainerOpen(false) }}>
                <IconContext.Provider value={{ size: "2em", color: "#626262", className: "rounded-5 border-dark" }}>
                    <IoArrowBackCircle />
                </IconContext.Provider>
            </button>
            <div className="messages-sec" style={{ height: "calc(100vh - 100px)", overflowY: "scroll" }}>
                {messages?.filter(item => (item.sender === session.user.email && item.to === selectedUser) || (item.sender === selectedUser && item.to === session.user.email) || (item.to === 'public' && selectedUser === 'public'))?.map((item, index) => (
                    <div key={index} className="d-flex flex-row align-items-center mb-2" style={{ position: "relative" }}>
                        <div className="avatar-sec d-flex flex-row align-items-center">
                            <IconContext.Provider value={{ color: "#626262", size: "2em", className: "rounded-5 border-dark" }}>
                                <FaUser />
                            </IconContext.Provider>
                            <div style={{ background: item.sender === session.user.email?"#3a9ff0":"#C6E3FA", width: "100%" }} className="rounded-5 p-2">{item.sender.substring(0, 7)}...</div>
                        </div>
                        <span className="fs-5 ps-2">{item.message}</span>
                    </div>
                ))}
            </div>
            <form onSubmit={addMessage} className="send-message-sec d-flex flex-row justify-content-center align-items-center" style={{ position: "absolute", bottom: "0", width: "100%", height: "50px", backgroundColor: "#FFF", border: "1px solid #C6E3FA" }}>
                <input type="text" onChange={(e) => { setNewMessage((e.target.value)); }} className="rounded-2 msgbox" style={{ width: "max(80%, 180px)", height: "35px", background: "#C6E3FA" }} />
                <button type="submit" className="btn d-flex justify-content-center align-items-center" style={{ width: "40px", height: "35px" }}>
                    <IconContext.Provider value={{ size: "4em", color: "#C6E3FA" }}>
                        <IoSend />
                    </IconContext.Provider>
                </button>
            </form>
        </div>
    )
}

export default ChatContainer