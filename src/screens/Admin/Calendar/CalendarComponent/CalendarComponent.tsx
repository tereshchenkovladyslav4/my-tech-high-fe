// import { Box, Grid } from '@mui/material'
// import * as React from 'react'
// import Paper from '@material-ui/core/Paper'
// import TableCell from '@material-ui/core/TableCell'
// import { darken, alpha, lighten } from '@material-ui/core/styles/colorManipulator'
// import { ViewState, EditingState } from '@devexpress/dx-react-scheduler'
// import classNames from 'clsx'
// import {
//   Scheduler,
//   MonthView,
//   Appointments,
//   Toolbar,
//   DateNavigator,
//   AppointmentTooltip,
//   AppointmentForm,
//   EditRecurrenceMenu,
//   Resources,
//   DragDropProvider,
// } from '@devexpress/dx-react-scheduler-material-ui'
// import { withStyles } from '@material-ui/core/styles'

// const CalendarComponent = () => {
//   const owners = [
//     {
//       text: 'Andrew Glover',
//       id: 1,
//       color: '#7E57C2',
//     },
//     {
//       text: 'Arnie Schwartz',
//       id: 2,
//       color: '#FF7043',
//     },
//     {
//       text: 'John Heart',
//       id: 3,
//       color: '#E91E63',
//     },
//     {
//       text: 'Taylor Riley',
//       id: 4,
//       color: '#E91E63',
//     },
//     {
//       text: 'Brad Farkus',
//       id: 5,
//       color: '#AB47BC',
//     },
//     {
//       text: 'Arthur Miller',
//       id: 6,
//       color: '#FFA726',
//     },
//   ]

//   const appointments = [
//     {
//       id: 0,
//       title: 'Club',
//       startDate: new Date(2021, 2, 1, 9, 30),
//       endDate: new Date(2021, 2, 1, 11, 30),
//       ownerId: 1,
//     },
//     {
//       id: 1,
//       title: 'Field Trip',
//       startDate: new Date(2021, 2, 2, 9, 30),
//       endDate: new Date(2021, 2, 2, 11, 30),
//       ownerId: 6,
//     },
//     {
//       id: 2,
//       title: 'Deadline',
//       startDate: new Date(2021, 2, 2, 9, 30),
//       endDate: new Date(2021, 2, 2, 11, 30),
//       ownerId: 3,
//     },
//   ]

//   const resources = [
//     {
//       fieldName: 'ownerId',
//       title: 'Owners',
//       instances: owners,
//     },
//   ]

//   const getBorder = (theme) =>
//     `1px solid ${
//       theme.palette.type === 'light'
//         ? lighten(alpha(theme.palette.divider, 1), 0.88)
//         : darken(alpha(theme.palette.divider, 1), 0.68)
//     }`

//   const DayScaleCell = (props) => (
//     <MonthView.DayScaleCell {...props} style={{ textAlign: 'center', fontWeight: 'bold' }} />
//   )

//   const styles = (theme) => ({
//     cell: {
//       color: '#78909C!important',
//       position: 'relative',
//       userSelect: 'none',
//       verticalAlign: 'top',
//       padding: 0,
//       height: 100,
//       borderLeft: getBorder(theme),
//       '&:first-child': {
//         borderLeft: 'none',
//       },
//       '&:last-child': {
//         paddingRight: 0,
//       },
//       'tr:last-child &': {
//         borderBottom: 'none',
//       },
//       '&:hover': {
//         backgroundColor: 'white',
//       },
//       '&:focus': {
//         backgroundColor: alpha(theme.palette.primary.main, 0.15),
//         outline: 0,
//       },
//     },
//     content: {
//       display: 'flex',
//       justifyContent: 'center',
//       width: '100%',
//       height: '100%',
//       position: 'absolute',
//       alignItems: 'center',
//     },
//     text: {
//       padding: '0.5em',
//       textAlign: 'center',
//     },
//     sun: {
//       color: '#FFEE58',
//     },
//     cloud: {
//       color: '#90A4AE',
//     },
//     rain: {
//       color: '#4FC3F7',
//     },
//     sunBack: {
//       backgroundColor: '#FFFFFF',
//     },
//     cloudBack: {
//       backgroundColor: '#FFFFFF',
//     },
//     rainBack: {
//       backgroundColor: '#E1F5FE',
//     },
//     opacity: {
//       opacity: '0.5',
//     },
//     appointment: {
//       borderRadius: '10px',
//       '&:hover': {
//         opacity: 0.6,
//       },
//     },
//     apptContent: {
//       '&>div>div': {
//         whiteSpace: 'normal !important',
//         lineHeight: 1.2,
//       },
//     },
//     flexibleSpace: {
//       flex: 'none',
//     },
//     flexContainer: {
//       display: 'flex',
//       alignItems: 'center',
//     },
//     tooltipContent: {
//       padding: theme.spacing(3, 1),
//       paddingTop: 0,
//       backgroundColor: theme.palette.background.paper,
//       boxSizing: 'border-box',
//       width: '400px',
//     },
//     tooltipText: {
//       ...theme.typography.body2,
//       display: 'inline-block',
//     },
//     title: {
//       ...theme.typography.h6,
//       color: theme.palette.text.secondary,
//       fontWeight: theme.typography.fontWeightBold,
//       overflow: 'hidden',
//       textOverflow: 'ellipsis',
//       whiteSpace: 'nowrap',
//     },
//     icon: {
//       color: theme.palette.action.active,
//       verticalAlign: 'middle',
//     },
//     circle: {
//       width: theme.spacing(4.5),
//       height: theme.spacing(4.5),
//       verticalAlign: 'super',
//     },
//     textCenter: {
//       textAlign: 'center',
//     },
//     dateAndTitle: {
//       lineHeight: 1.1,
//     },
//     titleContainer: {
//       paddingBottom: theme.spacing(2),
//     },
//     container: {
//       paddingBottom: theme.spacing(1.5),
//     },
//   })

//   const CellBase = React.memo(
//     ({
//       classes,
//       startDate,
//       formatDate,
//       otherMonth,
//       // #FOLD_BLOCK
//     }) => {
//       const iconId = Math.abs(Math.floor(Math.sin(startDate.getDate()) * 10) % 3)
//       const isFirstMonthDay = startDate.getDate() === 1
//       const formatOptions = isFirstMonthDay ? { day: 'numeric', month: 'long' } : { day: 'numeric' }
//       return (
//         <TableCell
//           tabIndex={0}
//           className={classNames({
//             [classes.cell]: true,
//             [classes.rainBack]: iconId == 0,
//             [classes.sunBack]: iconId === 1,
//             [classes.cloudBack]: iconId === 2,
//             [classes.opacity]: otherMonth,
//           })}
//         >
//           <div className={classes.content}></div>
//           <div className={classes.text}>{formatDate(startDate, formatOptions)}</div>
//         </TableCell>
//       )
//     },
//   )

//   const TimeTableCell = withStyles(styles, { name: 'Cell' })(CellBase)

//   const Appointment = withStyles(styles, {
//     name: 'Appointment',
//   })(({ classes, ...restProps }) => <Appointments.Appointment {...restProps} className={classes.appointment} />)

//   const AppointmentContent = withStyles(styles, {
//     name: 'AppointmentContent',
//   })(({ classes, ...restProps }) => <Appointments.AppointmentContent {...restProps} className={classes.apptContent} />)

//   const FlexibleSpace = withStyles(styles, {
//     name: 'ToolbarRoot',
//   })(({ classes, ...restProps }) => (
//     <Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}></Toolbar.FlexibleSpace>
//   ))

//   return (
//     <Box>
//       <Paper>
//         <Scheduler data={appointments}>
//           <EditingState onCommitChanges={() => {}} />
//           <ViewState defaultCurrentDate='2021-03-01' />
//           <MonthView timeTableCellComponent={TimeTableCell} dayScaleCellComponent={DayScaleCell} />
//           <Appointments appointmentComponent={Appointment} appointmentContentComponent={AppointmentContent} />
//           <Resources data={resources} />
//           <Toolbar flexibleSpaceComponent={FlexibleSpace} />
//           <DateNavigator />
//         </Scheduler>
//       </Paper>
//     </Box>
//   )
// }

// export default CalendarComponent
