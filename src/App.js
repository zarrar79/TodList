import React, { useState } from "react";
import './App.css'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

function App() {
  // const[selectOpt, setOpt] = useState('To do')
  const [state, setState] = useState({
    todo: {
      title: "To do",
      items: []
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
    console.log(destination,source);
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
    const itemCopy = {...state[source.droppableId].items[source.index]};
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
  const changeList = (value,index,title,status) => {
    // Get the select element by ID
  const selectElement = document.getElementById('mySelect');
  // console.log(status);
  // Get the selected option value
  var selectedOptionValue = selectElement.value;
  const nTask = {
    id:v4(),
    name : value,
   state : status
  };
    console.log(index, value,title,"---->");
    console.log(selectedOptionValue);
    if(selectedOptionValue === "Progress"){
    setState(prevState => ({
      ...prevState,
      inProgress: {
        ...prevState.inProgress,
        items: [...prevState.inProgress.items, nTask]
      }
    }));
    if(title==='To do'){
    // Define the index of the item you want to delete
const indexToDelete = value; // For example, let's say you want to delete the first item

// Create a copy of the todo items array
const updatedTodoItems = [...state.todo.items];

// Remove the item at the specified index
updatedTodoItems.splice(indexToDelete, 1);

// Update the state with the new array
setState(prevState => ({
  ...prevState,
  todo: {
    ...prevState.todo,
    items: updatedTodoItems
  }
}));
    }
    if(title==='Completed'){
    // Define the index of the item you want to delete
const indexToDelete = value; // For example, let's say you want to delete the first item

// Create a copy of the todo items array
const updatedTodoItems = [...state.done.items];
// Remove the item at the specified index
updatedTodoItems.splice(indexToDelete, 1);

// Update the state with the new array
setState(prevState => ({
  ...prevState,
  done: {
    ...prevState.done,
    items: updatedTodoItems
  }
}));
    }
    console.log(selectedOptionValue, title,"---> check");
  }
    if(selectedOptionValue === "Todo"){
    setState(prevState => ({
      ...prevState,
      todo: {
        ...prevState.todo,
        items: [...prevState.todo.items, nTask]
      }
    }));
      if(title==='In Progress'){
      // Define the index of the item you want to delete
  const indexToDelete = value; // For example, let's say you want to delete the first item
  // Create a copy of the todo items array
  const updatedTodoItems = [...state.inProgress.items];
  
  // Remove the item at the specified index
  updatedTodoItems.splice(indexToDelete, 1);
  
  // Update the state with the new array
  setState(prevState =>({
    ...prevState,
    inProgress: {
      ...prevState.inProgress,
      items: updatedTodoItems
    }
  }));
      }
      if(title==='Completed'){
      // Define the index of the item you want to delete
  const indexToDelete = value; // For example, let's say you want to delete the first item
  
  // Create a copy of the todo items array
  const updatedTodoItems = [...state.done.items];
  
  // Remove the item at the specified index
  updatedTodoItems.splice(indexToDelete, 1);
  
  // Update the state with the new array
  setState(prevState => ({
    ...prevState,
    done: {
      ...prevState.done,
      items: updatedTodoItems
    }
  }));
      }
  }
    if(selectedOptionValue==="Completed"){
    setState(prevState => ({
      ...prevState,
      done: {
        ...prevState.done,
        items: [...prevState.done.items, nTask]
      }
    }));
    if(title==='To do'){
      // Define the index of the item you want to delete
  const indexToDelete = value; // For example, let's say you want to delete the first item
  
  // Create a copy of the todo items array
  const updatedTodoItems = [...state.todo.items];
  
  // Remove the item at the specified index
  updatedTodoItems.splice(indexToDelete, 1);
  
  // Update the state with the new array
  setState(prevState => ({
    ...prevState,
    todo: {
      ...prevState.todo,
      items: updatedTodoItems
    }
  }));
      }
      if(title==='In Progress'){
      // Define the index of the item you want to delete
  const indexToDelete = value; // For example, let's say you want to delete the first item
  
  // Create a copy of the todo items array
  const updatedTodoItems = [...state.inProgress.items];
  
  // Remove the item at the specified index
  updatedTodoItems.splice(indexToDelete, 1);
  
  // Update the state with the new array
  setState(prevState => ({
    ...prevState,
    inProgress: {
      ...prevState.inProgress,
      items: updatedTodoItems
    }
  }));
      }
  }
  }
  const addItem = () => {
    if(input.trim()==="")
    return;
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
                      <div ref = {provided.innerRef} className="droppable-col">
                        {data.items.map((el, index) =>{
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}>
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
                                    <div>
                                    {el.name}
                                    </div>
                                    <div className="text-black">
                                      <select onChange={(event)=>changeList(el.name,index,data.title,event.target.value)} id="mySelect">
                                      <option value='Todo'>Todo</option>
                                      <option value='Progress'>In Progress</option>
                                      <option value='Completed'>Completed</option>
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