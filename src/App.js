import React, { useState } from "react";
import './App.css'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";
const item = {
  id: v4(),
  name: "First task"
};
const item2 = {
  id: v4(),
  name: "Second task"
};
function App() {
  const [state, setState] = useState({
    todo: {
      title: "To do",
      items: [item, item2]
    },
    inProgress: {
      title: "In Progress",
      items: []
    },
    done: {
      title: "Completed",
      items: []
    }
  });
  const [input, setInput] = useState("");
  const handleDragEnd = ({ destination, source }) => {
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
    const itemCopy = { ...state[source.droppableId].items[source.index]};
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

  const addItem = () => {
    setState((prev) => {
      return {
        ...prev,
        todo: {
          ...prev.todo,
          items: [{ id: v4(), name: input }, ...prev.todo.items]
        }
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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <button onClick={addItem}>Add</button>
      </form>
      <div className="App">
        <DragDropContext onDragEnd={handleDragEnd}>
          {_.map(state, (data, key) =>{
            return (
              <div key={key} className="column">
                <h3>{data.title}</h3>
                <Droppable droppableId={key}>
                  {(provided) => {
                    return (
                      <div ref={provided.innerRef} className="droppable-col">
                        {data.items.map((el, index) =>{
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                              //rdnd uses this id to distinguish dragged item
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className={`item ${
                                      snapshot.isDragging && "dragging"
                                    }`}
                                    //This ref is used for recognize to draggable item from DOM
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    //This prop helps us to recognize, where we can hold item to drag
                                    // If we add this to inner child of this div, then that we can drag div only by holding from that child
                                    {...provided.dragHandleProps}
                                  >
                                    {el.name}
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