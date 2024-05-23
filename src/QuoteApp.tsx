import React, { useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Quote {
  id: string;
  content: string;
}

const initial: Quote[] = [];

const grid = 8;

const reorder = (
  list: Quote[],
  startIndex: number,
  endIndex: number
): Quote[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const QuoteItem = styled.div`
  width: 200px;
  border: 1px solid grey;
  margin-bottom: ${grid}px;
  background-color: #91d2e4;
  padding: ${grid}px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  background-color: #dd8f8f;
  color: white;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const QuoteComponent: React.FC<{
  quote: Quote;
  index: number;
  onDelete: (id: string) => void;
}> = ({ quote, index, onDelete }) => (
  <Draggable draggableId={quote.id} index={index}>
    {(provided) => (
      <QuoteItem
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {quote.content}
        <DeleteButton onClick={() => onDelete(quote.id)}>Delete</DeleteButton>
      </QuoteItem>
    )}
  </Draggable>
);

const QuoteList: React.FC<{ quotes: Quote[]; onDelete: (id: string) => void }> =
  React.memo(({ quotes, onDelete }) => (
    <>
      {quotes.map((quote, index) => (
        <QuoteComponent
          quote={quote}
          index={index}
          key={quote.id}
          onDelete={onDelete}
        />
      ))}
    </>
  ));

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f0f0f0;
`;

const InputContainer = styled.div`
  display: flex;
  margin-bottom: ${grid * 2}px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: ${grid}px;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: ${grid}px;
  font-size: 16px;
  background-color: #308b97;
  color: white;
  border: none;
  cursor: pointer;
`;

const QuotesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function QuoteApp() {
  const [quotes, setQuotes] = useState<Quote[]>(initial);
  const [newQuote, setNewQuote] = useState("");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedQuotes = reorder(
      quotes,
      result.source.index,
      result.destination.index
    );

    setQuotes(reorderedQuotes);
  };

  const handleDelete = (id: string) => {
    const updatedQuotes = quotes.filter((quote) => quote.id !== id);
    setQuotes(updatedQuotes);
  };

  const handleAddQuote = () => {
    if (newQuote.trim() === "") {
      return;
    }

    const newQuoteObj: Quote = {
      id: nanoid(),
      content: newQuote,
    };

    setQuotes([...quotes, newQuoteObj]);
    setNewQuote("");
  };

  return (
    <AppContainer>
      <InputContainer>
        <Input
          type="text"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="Enter new quote"
        />
        <AddButton onClick={handleAddQuote}>Add Quote</AddButton>
      </InputContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <QuotesContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <QuoteList quotes={quotes} onDelete={handleDelete} />
              {provided.placeholder}
            </QuotesContainer>
          )}
        </Droppable>
      </DragDropContext>
    </AppContainer>
  );
}

export default QuoteApp;
