import React, { Component } from 'react';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import './App.css';
import axios from 'axios';

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

    this.fetchRankings = this.fetchRankings.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount(){
    this.fetchRankings();
  }

  fetchRankings() {
    axios.get('/data')
      .then(response => {
        console.log(response.data.rb);
        console.log(response.data.wr);
        this.setState({
          rb: response.data.rb,
          wr: response.data.wr,
          te: response.data.te,
          qb: response.data.qb
        });
      });
  }

  handleUpload(e) {
    e.preventDefault();

    var data = new FormData();
    console.log("We're in the upload method");

    data.append('file', this.uploadInput.files[0]);

    axios.post("/upload-csv", data)
      .then(() => {
        console.log("Uploaded!");
      });

    this.fetchRankings(); 
  }
  
  updateRankings(updatedList, position){
    // const data = { "position": position, "list": updatedList };

    // axios.put("/data", data);
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
          <tbody>
            <tr className="list-table-header-row">
              <th>Running Backs</th>
              <th>Wide Receivers</th>
              <th>Tight Ends</th>
              <th>Quarterbacks</th>
            </tr>

            <tr className="list-table-row">
              <td>
                <SortableList items={this.state.rb} onSortEnd={this.onRbSortEnd} />
                <form onSubmit={this.updateRankings(this.state.rb, "rb")}><button>Save</button></form>
              </td>
              <td>
                <SortableList items={this.state.wr} onSortEnd={this.onWrSortEnd} />
                <form onSubmit={this.updateRankings(this.state.wr, "wr")}><button>Save</button></form>
              </td>
              <td>
                <SortableList items={this.state.te} onSortEnd={this.onTeSortEnd} />
                <form onSubmit={this.updateRankings(this.state.te, "te")}><button>Save</button></form>
              </td>
              <td>
                <SortableList items={this.state.qb} onSortEnd={this.onQbSortEnd} />
                <form onSubmit={this.updateRankings(this.state.qb, "qb")}><button>Save</button></form>
              </td>
            </tr>
          </tbody>
        </table>

        <form onSubmit={this.handleUpload}>
          <input ref={(ref) => {this.uploadInput = ref; }} type = "file" id="fileUpload" name="fileUpload" />
          <button>Upload</button>
        </form>
      </div>
    );
  }
}

export default App;
