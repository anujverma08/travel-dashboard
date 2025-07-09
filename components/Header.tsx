import React, { use } from 'react'
import { useLocation } from 'react-router';

interface Props {
  title: string;
  description: string;
}

const Header = ({title, description }: Props) => {
    const location = useLocation();
  return (
    <header className='header'>
        <article>
            <h1 className='{cn("text-dark-100',>{title}</h1>
            <p>{description}</p>
        </article>
    </header>
  )
}

export default Header