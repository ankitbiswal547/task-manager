import React, { useState, useRef, useEffect } from 'react';
import uuid from 'react-uuid'

function DragNDrop({ data, onFormSubmit }) {

    const [list, setList] = useState(data);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        setList(data);
    }, [setList, data])

    const dragItem = useRef();
    const dragItemNode = useRef();

    const handletDragStart = (e, item) => {

        dragItemNode.current = e.target;
        dragItemNode.current.addEventListener('dragend', handleDragEnd)
        dragItem.current = item;

        setTimeout(() => {
            setDragging(true);
        }, 0)
    }
    const handleDragEnter = (e, targetItem) => {
        if (dragItemNode.current !== e.target) {
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
                newList[targetItem.grpI].items.splice(targetItem.itemI, 0, newList[dragItem.current.grpI].items.splice(dragItem.current.itemI, 1)[0])
                dragItem.current = targetItem;
                localStorage.setItem('List', JSON.stringify(newList));
                return newList
            })
        }
    }
    const handleDragEnd = (e) => {
        setDragging(false);
        dragItem.current = null;
        dragItemNode.current.removeEventListener('dragend', handleDragEnd)
        dragItemNode.current = null;
    }
    const getStyles = (item) => {
        if (dragItem.current.grpI === item.grpI && dragItem.current.itemI === item.itemI) {
            return "each-task current"
        }
        return "each-task"
    }


    const showFormHandler = (e, id) => {
        if (id === 0) {
            let ele = document.querySelector(".form-not-started");
            ele.classList.add("active");
            document.querySelector(".addnew-ns").style.display = "none";
            document.querySelector(".cancel-ns").style.display = "flex";
        } else if (id === 1) {
            let ele = document.querySelector(".form-in-progress");
            ele.classList.add("active");
            document.querySelector(".addnew-ip").style.display = "none";
            document.querySelector(".cancel-ip").style.display = "flex";
        } else {
            let ele = document.querySelector(".form-completed");
            ele.classList.add("active");
            document.querySelector(".addnew-c").style.display = "none";
            document.querySelector(".cancel-c").style.display = "flex";
        }

    }

    const formSubmitHandler = (e, id) => {
        e.preventDefault();
        if (e.target.name.value === "" || e.target.status.value === "" || e.target.desc.value === "") return;
        if (id === 0) {
            let ele = document.querySelector(".form-not-started");
            ele.classList.remove("active");
            document.querySelector(".addnew-ns").style.display = "flex";
            document.querySelector(".cancel-ns").style.display = "none";
        } else if (id === 1) {
            let ele = document.querySelector(".form-in-progress");
            ele.classList.remove("active");
            document.querySelector(".addnew-ip").style.display = "flex";
            document.querySelector(".cancel-ip").style.display = "none";
        } else {
            let ele = document.querySelector(".form-completed");
            ele.classList.remove("active");
            document.querySelector(".addnew-c").style.display = "flex";
            document.querySelector(".cancel-c").style.display = "none";
        }

        const newTask = {
            id: uuid(),
            name: e.target.name.value,
            status: e.target.status.value,
            description: e.target.desc.value
        }

        e.target.name.value = "";
        e.target.status.value = ""
        e.target.desc.value = ""
        onFormSubmit(newTask, id);
    }


    const cancelFormHandler = (e, id) => {
        if (id === 0) {
            let ele = document.querySelector(".form-not-started");
            ele.classList.remove("active");
            document.querySelector(".addnew-ns").style.display = "flex";
            document.querySelector(".cancel-ns").style.display = "none";
        } else if (id === 1) {
            let ele = document.querySelector(".form-in-progress");
            ele.classList.remove("active");
            document.querySelector(".addnew-ip").style.display = "flex";
            document.querySelector(".cancel-ip").style.display = "none";
        } else {
            let ele = document.querySelector(".form-completed");
            ele.classList.remove("active");
            document.querySelector(".addnew-c").style.display = "flex";
            document.querySelector(".cancel-c").style.display = "none";
        }

    }

    if (list) {
        return (
            <div className='home'>
                <h1 className='home-title'>Task Manager</h1>
                <div className="home-container">
                    {list.map((grp, grpI) => (
                        <div key={grp.title} onDragEnter={dragging && !grp.items.length ? (e) => handleDragEnter(e, { grpI, itemI: 0 }) : null} className={(grpI === 0) ? "cards not-started" : (grpI === 1) ? "cards in-progess" : "cards completed"}>
                            <div className='actions-area'>
                                <div className='actions-area-left'>
                                    <span className={(grpI === 0) ? "cur-status not-started" : (grpI === 1) ? "cur-status in-progress" : "cur-status completed"}>{grp.title}</span>
                                    <span className='cur-status-count'>{grp.items.length}</span>
                                </div>
                                <div className='actions-area-right'>
                                    <i className="fa-solid fa-ellipsis"></i>
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            </div>
                            {grp.items.map((item, itemI) => (
                                <div draggable key={item.id} onDragStart={(e) => handletDragStart(e, { grpI, itemI })} onDragEnter={dragging ? (e) => { handleDragEnter(e, { grpI, itemI }) } : null} className={dragging ? getStyles({ grpI, itemI }) : "each-task"}>
                                    {item.name}
                                </div>
                            ))}
                            <div className='add-new-area'>
                                <button onClick={(e) => showFormHandler(e, grpI)} className={(grpI === 0) ? 'new-task-btn addnew-ns' : (grpI === 1) ? "new-task-btn addnew-ip" : "new-task-btn addnew-c"}><i className="fa-solid fa-plus"></i> New</button>
                                <button onClick={(e) => cancelFormHandler(e, grpI)} className={(grpI === 0) ? 'new-task-btn cancel-ns' : (grpI === 1) ? "new-task-btn cancel-ip" : "new-task-btn cancel-c"}><i className="fa-solid fa-xmark"></i> Cancel</button>
                            </div>
                            <form onSubmit={(e) => formSubmitHandler(e, grpI)} className={(grpI === 0) ? "home-form form-not-started" : (grpI === 1) ? "home-form form-in-progress" : "home-form form-completed"}>
                                <h2>Add a new task</h2>
                                <span className='msg-span'>All fields are required.</span>
                                <div className='form-input'>
                                    <label htmlFor="name">Title :</label>
                                    <input id='name' type="text" name='name' />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor="status">Status :</label>
                                    <input id='status' type="text" name='status' value={grp.title} disabled />
                                </div>
                                <div className='form-input'>
                                    <label htmlFor="desc">Description :</label>
                                    <input id='desc' name='desc' type="text" />
                                </div>
                                <button className='home-form-btn'>Submit</button>
                            </form>
                        </div>
                    ))}
                </div>
            </div>
        )
    } else { return null }

}

export default DragNDrop;