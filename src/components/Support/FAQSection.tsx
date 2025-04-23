import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "Как мне восстановить пароль от аккаунта?",
      answer: "Для восстановления пароля перейдите на страницу входа и нажмите 'Забыли пароль?'. Введите адрес электронной почты, связанный с вашим аккаунтом, и следуйте инструкциям в письме, которое мы вам отправим."
    },
    {
      question: "Как изменить способ оплаты?",
      answer: "Войдите в свой аккаунт, перейдите в раздел 'Настройки' -> 'Платежная информация'. Там вы сможете добавить новый способ оплаты или изменить существующий."
    },
    {
      question: "Как отменить подписку?",
      answer: "Для отмены подписки зайдите в раздел 'Настройки' -> 'Подписки и платежи' и нажмите 'Отменить подписку'. Подтвердите свое действие и следуйте инструкциям на экране."
    },
    {
      question: "Как связаться с представителем службы поддержки?",
      answer: "Вы можете связаться с нами, заполнив форму на этой странице, позвонив по телефону 8-800-123-45-67 или написав на email support@example.com. Также доступен онлайн-чат в правом нижнем углу сайта."
    },
    {
      question: "Каковы сроки рассмотрения обращений?",
      answer: "Мы стараемся отвечать на все обращения в течение 24 часов. В периоды высокой нагрузки ответ может занять до 48 часов. Приоритетная поддержка доступна для пользователей с премиум-подпиской."
    }
  ];

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq" id="faq">
      <h2>Часто задаваемые вопросы</h2>
      
      {faqItems.map((item, index) => (
        <div 
          key={index} 
          className={`accordion ${activeIndex === index ? 'active' : ''}`}
        >
          <div 
            className="accordion-header" 
            onClick={() => toggleAccordion(index)}
          >
            {item.question}
            <span>{activeIndex === index ? '-' : '+'}</span>
          </div>
          {activeIndex === index && (
            <div className="accordion-body">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQSection;