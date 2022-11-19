import { React } from 'react';
import { useEffect } from 'react';
import MenuBar from '../components/side_menu/side_menu';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Страница не найдена';
  });
  return (
    <>
      <MenuBar />
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#202020',
            textAlign: 'center',
            // borderRadius: '0.5em',
            fontVariantCaps: 'all-petite-caps',
            fontSize: '2em',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: '1.6em',
              paddingTop: '1.4em',
              fontWeight: 'bold',
            }}
          >
            {'404 Страница не найдена'}
            <div
              style={{
                padding: '.3em',
                fontSize: '0.6em',
                fontVariantCaps: 'normal',
              }}
            >
              {'Вы можете вернуться назад, нажав кнопку в левом верхнем углу.'}
            </div>
          </div>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/8811/8811036.png"
          style={{ margin: '6em',   margin: 'auto', width: '20%', padding: 0, marginTop: '6em'}}
          draggable={false}
        />
      </div>
    </>
  );
};

export default NotFoundPage;
