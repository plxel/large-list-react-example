import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import ArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward'
import ArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward'

const makeSortIcon = (field, sortBy) => (
  sortBy.field === field ?
    (sortBy.order === 1 ? <ArrowDownward /> : <ArrowUpward />)
    : undefined
)

const camelize = (str) =>
  str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase()
  }).replace(/\s+/g, '')

const DataList = ({ itemHeight, virtual, sortBy, onHeadClick, withGrouping, groupBy, sortableFields }) => {
  const fields = [ "First Name", "Last Name", "Group" ]

  return (
    <div>
      <div className="row-head">
        {fields.map((f, i) => {
          let fName = camelize(f)
          const sortProps = sortableFields.indexOf(fName) < 0
            ? { disabled : true}
            : {
                onTouchTap : () => onHeadClick(fName),
                icon : makeSortIcon(fName, sortBy)
              };

          return (<div key={i} className="cell">
            <RaisedButton
               label={f}
               labelPosition="before"
               primary={true}
               {...sortProps}
               className="md-btn"
             />
          </div>)
        })}
      </div>

      <div style={virtual.style}>
        <div>
          {virtual.items.map((u, i) =>
            <div
              key={`${u._id ? u._id : i}`}
              className="row"
              style={{ height: itemHeight }}
              >
              <div className="cell">{u.firstName}</div>
              <div className="cell">{u.lastName}</div>
              <div className="cell">{u.group}</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .row-head {
          padding: 0px 0px 14px;
          background: #f4f4f4;
        }
        .row, .row-head {
          border: 1px solid gray;
          border-bottom-width: 0px;
        }
        .row:nth-child(odd) {
          background: #f0f0f0;
        }
        .row:last-child {
          border-bottom-width: 1px;
        }
        .cell {
          display: inline-block;
          vertical-align: top;
          padding-top: 14px;
          text-align: center;
          width: 33.3%;
          height: 100%;
        }
        @media (max-width: 767px) {
          .row-head {
            margin: 0px;
          }
        }
      `}</style>
    </div>
  );
};

export default DataList;
