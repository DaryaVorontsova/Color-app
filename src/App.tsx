import './App.css';
import { MainForm } from './components/main-form';

export const App = () => {
  return (
    <div>
      <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-indigo-900">
        Сортировка по спектру
      </h1>
      <MainForm />
    </div>
  );
};
