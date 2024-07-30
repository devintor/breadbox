import { useNavigate } from "react-router-dom";
import { EventType } from "../../lib/types";
import { useEffect, useState } from "react";
import { createEvent } from "../../firebase/eventsfunctions";

const CreateEvent = () => {
    const navigate = useNavigate();
    const [event, setEvent] = useState<EventType>();

    useEffect(()=> {
        console.log(event)
    }, [event])

    return (
        <>
            <button onClick={() => navigate('/admin/events')}>Back</button>
            <form onSubmit={(e) => {
                e.preventDefault()
                event && createEvent(event).then(result => navigate(-1)).catch(err => console.log(err))
            }}>
                <h3>Create Event</h3>

                <div className="mb-3">
                    <label>Title</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Title"
                    onChange={(e) => setEvent((prev) => ({
                        ...prev,
                        title: e.target.value
                    }))}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label>Description</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    onChange={(e) => setEvent((prev) => ({
                        ...prev,
                        description: e.target.value
                    }))}
                    // required
                    />
                </div>

                <div className="mb-3">
                    <label>Company</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Company"
                    onChange={(e) => setEvent((prev) => ({
                        ...prev,
                        company: e.target.value
                    }))}
                    // required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>

                {/* <div className="mb-3">
                    <label>Email Address</label>
                    <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>

                <div className="mb-3">
                    <label>Password</label>
                    <button type="button" className="btn" data-toggle="button" aria-pressed="false" id="eye" onClick={toggleVisibility}>
                        <img src="https://cdn0.iconfinder.com/data/icons/feather/96/eye-16.png" alt="eye" />
                    </button>
                    <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                    Sign Up
                    </button>
                </div>
                <p className="forgot-password text-right">
                    Already Registered? <a href="/auth/login">Login</a>
                </p> */}
            </form>
        </>
    )
}

export default CreateEvent;