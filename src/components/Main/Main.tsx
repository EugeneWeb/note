import { Navigate} from 'react-router-dom';

import { useAppSelector } from '../../hooks/useAppSelector';
import { MainHeader } from './MainHeader/MainHeader';
import { Notes } from './Notes/Notes';


export const Main = () => {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    if(!isAuth) return <Navigate to='/auth' />

    return (
        <div>
            <MainHeader />
            <Notes />
        </div>
    );
};