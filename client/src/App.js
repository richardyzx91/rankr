import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import './App.css';

const DragHandle = SortableHandle(() => 
  <span>
  </span>);

const SortableItem = SortableElement(({value, index}) =>
  <li className="item">
    {value}
  </li>
);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul className="list">
      {items.map((value, index) => (
        <table>
          <tr>
            <td className="index-cell">{index + 1}.</td>
            <td><SortableItem key={`player-${index}`} index={index} value={value} /></td>
          </tr>
        </table>
      ))}
    </ul>
  )
});

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      rb: [],
      wr: [],
      te: [],
      qb: []
    };
  }

  componentDidMount(){
    this.fetchRankings();
  }

  fetchRankings() {
    fetch("/data")
    .then(response => response.json())
    .then(data => 
      this.setState({
        rb: data.rb,
        wr: data.wr,
        te: data.te,
        qb: data.qb
      }, () => console.log("Data fetched!"))
    );
  }

  onRbSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      rb: arrayMove(this.state.rb, oldIndex, newIndex),
    });
  };

  onWrSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      wr: arrayMove(this.state.wr, oldIndex, newIndex),
    });
  };

  onTeSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      te: arrayMove(this.state.te, oldIndex, newIndex),
    });
  };

  onQbSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      qb: arrayMove(this.state.qb, oldIndex, newIndex),
    });
  };

  render(){
    return(
      <div>
        <table className="list-table">
          <tr className="list-table-header-row">
            <th>Running Backs</th>
            <th>Wide Receivers</th>
            <th>Tight Ends</th>
            <th>Quarterbacks</th>
          </tr>

          <tr className="list-table-row">
            <td>
              <SortableList items={this.state.rb} onSortEnd={this.onRbSortEnd} />
            </td>
            <td>
              <SortableList items={this.state.wr} onSortEnd={this.onWrSortEnd} />
            </td>
            <td>
              <SortableList items={this.state.te} onSortEnd={this.onTeSortEnd} />
            </td>
            <td>
              <SortableList items={this.state.qb} onSortEnd={this.onQbSortEnd} />
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default App;
