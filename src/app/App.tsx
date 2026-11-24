import {HashRouter} from 'react-router-dom';
import {ProgressProvider} from './ProgressContext';
import {Shell} from '../components/layout/Shell';
import Router from './router';
export default function App(){return <HashRouter><ProgressProvider><Shell><Router/></Shell></ProgressProvider></HashRouter>}
