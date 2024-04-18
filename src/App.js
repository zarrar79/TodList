import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

function App() {
  // const[selectOpt, setOpt] = useState('To do')
  const [message,setMessage] = useState("");
  const [state, setState] = useState({
    todo: {
      title: "To do",
      items: [],
    },
    inProgress: {
      title: "In Progress",
      items: [],
    },
    done: {
      title: "Completed",
      items: [],
    },
  });
  const [input, setInput] = useState("");
  console.log(state, "------>state");
  const handleDragEnd = ({ destination, source }) => {
    console.log(destination, source);
    if (!destination) {
      return console.log("Not dropped inside dropable");
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      console.log("dropped in same place");
    }
    //Generating an copy of object
    //If we dont do this then we can't add item to other list
    const itemCopy = { ...state[source.droppableId].items[source.index] };
    setState((prev) => {
      //Copying old state
      prev = { ...prev };
      //Deleting item from source list
      prev[source.droppableId].items.splice(source.index, 1);
      //Adding item to destination list and selected index
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );
      return prev;
    });
  };
  const changeList = (taskIndex, sourceListKey, destinationListKey) => {
    setMessage(destinationListKey);
    setState((prevState) => {
      const newState = { ...prevState };
      const taskToMove = newState[sourceListKey].items.splice(taskIndex, 1)[0];
      newState[destinationListKey].items.push(taskToMove);
      return newState;
    });
  };

  const addItem = () => {
    if (input.trim() === "") return;
    setState((prev) => {
      return {
        ...prev,
        todo: {
          ...prev.todo,
          items: [{ id: v4(), name: input }, ...prev.todo.items],
        },
      };
    });
    setInput("");
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-center mb-1 w-[100%] mt-4">
        <div>
        <input
          className="border-[2px] border-solid px-1 py-1 border-[#0eb265] border-[solid]" placeholder="New Task"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <button className="bg-[#6363b3] text-[white] py-[5.8px] px-4" onClick={addItem}>Add</button>
        </div>
        </div>
      </form>
      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) => {
            return (
              <div key={key} className="column border-[1px] border-[#e1d4d4] border-[solid]">
                <div className='bg-[#5e89ca] text-center py-2 items-center flex justify-center'><h3>{data.title}</h3></div>
                <Droppable droppableId={key}>
                  {(provided) => {
                    return (
                      <div ref={provided.innerRef} className="droppable-col">
                        {data.items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div>{el.name}</div>
                                    <div className="text-black">
                                      <select
                                        onChange={(e) =>
                                          changeList(index, key, e.target.value)
                                        }
                                      >
                                        {Object.keys(state).map(
                                          (destinationList, destinationIndex) =>
                                            destinationList !== data && (
                                              <option
                                                key={destinationIndex}
                                                value={destinationList}
                                              >
                                                {state[destinationList].title}
                                              </option>
                                            )
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </>
  );
}

export default App;
