import React from 'react'
import ComponentPopulator from "../utils/ComponentPopulator";
import StateController from "../redux/StateController";


export default class ComponentLoader extends React.Component{

  constructor(props){
    super(props);
    this.state = this.initState();
  }

  initState(){
    const [MainComponent, reduxState] = this.populateComponents();
    return {
      reduxLoaded: false,
      MainComponent: MainComponent,
      reduxState: reduxState
    }
  }

  componentDidMount(){
    if(this.reduxIsRequired()){
      StateController.populateState(this.state.reduxState,this.props.dispatch);
      this.setState({reduxLoaded:true});
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps !== this.props)
      this.setState(this.initState());
    else if(this.reduxIsRequired() && !this.state.reduxLoaded){
      StateController.populateState(this.state.reduxState,this.props.dispatch);
      this.setState({reduxLoaded:true});
    }
  }

  shouldComponentUpdate(nextProps,nextState){
    return this.props !== nextProps ||
          this.state !== nextState ||
          this.state.reduxLoaded !== nextState.reduxLoaded;
  }

  populateComponents(){
    return new ComponentPopulator(this.props.components,this.props.resources)
          .populateComponents(this.props.page);
  }
  
  reduxIsRequired(){
    return Object.keys(this.state.reduxState).length > 0;
  }

  render() {
    if(this.reduxIsRequired() && !this.state.reduxLoaded) return <React.Fragment/>;
    const MainComponent = this.state.MainComponent;
    return <MainComponent/>;
  }
}

