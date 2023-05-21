import React, { useEffect, useState } from "react";
import { Popover, Button, TextField, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import { moveItems, useDraggableContext } from "react-tiny-dnd";
import CampaignService from "../services/CampaignService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

type PopoverComponentProps = {
  onPopoverData: (data: any) => void;
  filter: any;
};

const EditFilterPopover: React.FC<PopoverComponentProps> = (props) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filters, setFilter] = useState([]);

  const [allFilters, setAllFilter] = useState([]);
  const [conditionsType, setConditionsType] = useState("and");

  const iconSize = {
    fontSize: { xs: "20px", md: "22px", lg: "24px" }
  };

  useEffect(() => {
    console.log("A");
    setFilter(props.filter);
  }, [props.filter]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addFilter = () => {
    let tempFilter = [...filters];
    tempFilter.push(allFilters[0]);
    setFilter(tempFilter);
  };

  const onDrop = (result) => {
    if (!result.destination) return; // Item was dropped outside the list
    const { source, destination } = result;
    const nextFilters = moveItems(filters, source.index, destination.index);
    setFilter(nextFilters);
  };

  const context = useDraggableContext({
    onDrop
  });

  const getAllFilters = () => {
    CampaignService.getFilters().then((res) => {
      res.data = res.data.map((filter) => {
        filter["selectedValue"] = "";
        filter["selectedOperator"] = "";
        return filter;
      });

      setAllFilter(res.data);
      console.log(res.data);
    });
  };

  useEffect(() => {
    getAllFilters();
  }, []);

  const handleFilter = (val, index) => {
    let element = allFilters.filter((ftr) => {
      if (ftr.attribute == val) {
        return ftr;
      }
    });

    let tempFilters = JSON.parse(JSON.stringify(filters));

    tempFilters[index] = element[0];

    setFilter(tempFilters);
  };

  const handleOperator = (val, index) => {
    let tempFilters = JSON.parse(JSON.stringify(filters));

    tempFilters[index].selectedOperator = val;

    setFilter(tempFilters);
  };

  const handleValue = (val, index) => {
    let tempFilters = JSON.parse(JSON.stringify(filters));

    tempFilters[index].selectedValue = val;

    setFilter(tempFilters);
  };

  const handleConditions = (val) => {
    setConditionsType(val);
  };

  const handlePopData = () => {
    setTimeout(() => {
      props.onPopoverData(filters);
    }, 500);
  };

  const applyFilter = () => {
    handlePopData();
  };

  const handleRemoveFilter = (i) => {
    let tempFilter = JSON.parse(JSON.stringify(filters));

    tempFilter = tempFilter.filter((filter, key) => {
      if (key != i) {
        return filter;
      }
    });

    setFilter(tempFilter);
  };

  return (
    <>
      <Button fullWidth variant="contained" onClick={handleClick}>
        Edit Filters
      </Button>
      <Popover
        sx={{ width: "100%" }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
      >
        <div className="popover-container">
          {filters.length == 0 ? (
            <>
              <div className="font-14 mb-16" style={{ width: "500px" }}>
                No filter conditions are added
              </div>
            </>
          ) : (
            <>
              <div className="font-14 mb-16">In this view, filter contacts</div>
            </>
          )}
          <DragDropContext onDragEnd={onDrop}>
            <Droppable droppableId="filterList">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {filters.map((filter, index) => (
                    <Draggable key={index} draggableId={`filter-${index}`} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="d-flex align-items-center gap-4 mb-15">
                            {index === 0 ? (
                              <div className="font-14" style={{ marginRight: "40px" }}>
                                Where
                              </div>
                            ) : index === 1 ? (
                              <TextField
                                select
                                value={conditionsType}
                                onChange={(e) => handleConditions(e.target.value)}
                                size="small"
                                style={{ width: 80 }}
                              >
                                <MenuItem value="and">and</MenuItem>
                                <MenuItem value="or">or</MenuItem>
                              </TextField>
                            ) : (
                              <div className="font-14" style={{ marginRight: "57px" }}>
                                {conditionsType}
                              </div>
                            )}
                            <div>
                              <TextField
                                select
                                label="Field"
                                variant="outlined"
                                size="small"
                                value={filter.attribute}
                                onChange={(e) => handleFilter(e.target.value, index)}
                                style={{ width: 200 }}
                              >
                                {allFilters.map((ftr, index) => (
                                  <MenuItem key={index} value={ftr.attribute}>
                                    {ftr.name}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div>
                              <TextField
                                select
                                label="Operator"
                                size="small"
                                value={filter.selectedOperator}
                                onChange={(e) => handleOperator(e.target.value, index)}
                                variant="outlined"
                                style={{ width: 200 }}
                              >
                                {filter.operator.map((ftr, index) => (
                                  <MenuItem key={index} value={ftr}>
                                    {ftr}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </div>
                            <div>
                              {filter.type === "select" ? (
                                <>
                                  <TextField
                                    select
                                    label="Value"
                                    size="small"
                                    value={filter.selectedValue}
                                    onChange={(e) => handleValue(e.target.value, index)}
                                    variant="outlined"
                                    style={{ width: 200 }}
                                  >
                                    {filter.value.map((ftr, index) => (
                                      <MenuItem key={index} value={ftr.value}>
                                        {ftr.key}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </>
                              ) : (
                                <>
                                  <TextField
                                    type="text"
                                    label="Value"
                                    size="small"
                                    value={filter.selectedValue}
                                    onChange={(e) => handleValue(e.target.value, index)}
                                    variant="outlined"
                                    style={{ width: 200 }}
                                  ></TextField>
                                </>
                              )}
                            </div>
                            <div onClick={() => handleRemoveFilter(index)}>
                              <DeleteIcon sx={iconSize} />
                            </div>
                            <div>
                              <DragIndicatorIcon sx={iconSize} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div>
            <div className="d-flex align-items-center gap-2 mt-20">
              <div className="add-btn" onClick={addFilter}>
                <AddIcon />
                Add condition
              </div>
            </div>
            {filters.length > 0 ? (
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={applyFilter}>
                Save
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </Popover>
    </>
  );
};

export default EditFilterPopover;
