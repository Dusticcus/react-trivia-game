import axios from 'axios';

import { useEffect, useState } from 'react'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

let category = "&category=20"

let API_URL = `https://opentdb.com/api.php?amount=20&${category}&type=multiple`;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function Game() {

    const [apiResponse, setApiResponse] = useState(null);

    const [questionNumber, setQuestionNumber] = useState(0);
    const [questionText, setQuestionText] = useState("");

    const [answerArray, setAnswerArray] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState("");

    const [score, setScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);

    const [canClick, setCanClick] = useState(true);
    const [showSlider, setShowSlider] = useState(false);
    const [rangeValue, setRangeValue] = useState(100);
    const [rangePercent, setRangePercent] = useState("%");
    const [rangeColor, setRangeColor] = useState("orange");
    const handleAnswerClick = (event) => {
        let countdown = 3;
        let newRangeValue = 100;
        if (score < 10 && opponentScore < 10 && canClick) {
            console.log(event.target.getAttribute("data-answer"));
            setCanClick(false);
            if (correctAnswer === event.target.getAttribute("data-answer")) {
                console.log("correct selection");
                setScore(score + 1);
                setRangeColor("green");
            } else {
                console.log("incorrect selection");
                setOpponentScore(opponentScore + 1);
                setRangeColor("red");
            }
            let myInterval = setInterval(function () {
                countdown--;
                console.log(countdown);
            }, 1000);

            let rangeInterval = setInterval(function () {
                setShowSlider(true);
                newRangeValue = newRangeValue - 1;
                setRangeValue(newRangeValue);
                console.log(rangeValue)
            }, 30);

            setTimeout(() => {
                setQuestionNumber(questionNumber + 1);
                clearInterval(myInterval);
                clearInterval(rangeInterval);
                setCanClick(true);
                setShowSlider(false);
            }, 3000);


        }
    }

    useEffect(() => {
        axios.get(`${API_URL}`).then(function (response) {
            console.log(response.data.results[questionNumber]);
            setApiResponse(response.data.results);
            setQuestionText(response.data.results[questionNumber].question);

            let incAnswers = response.data.results[questionNumber].incorrect_answers;
            let corAnswer = response.data.results[questionNumber].correct_answer;
            setCorrectAnswer(corAnswer);
            incAnswers.push(corAnswer)
            shuffleArray(incAnswers);
            setAnswerArray(incAnswers);
        });
    }, []);

    useEffect(() => {
        if (apiResponse && score < 10 && opponentScore < 10) {
            setQuestionText(apiResponse[questionNumber].question);

            let incAnswers = apiResponse[questionNumber].incorrect_answers;
            let corAnswer = apiResponse[questionNumber].correct_answer;
            setCorrectAnswer(corAnswer);
            incAnswers.push(corAnswer)
            shuffleArray(incAnswers);
            setAnswerArray(incAnswers);
        }
    }, [questionNumber]);



    return (
        <Container fluid>
            <Row>
                <Col>
                    <h3>{questionText}</h3>
                </Col>
                <Col>
                    {answerArray &&
                        <Card className='cardHeight'>
                            <Card.Body>
                                {/* <Card.Title></Card.Title> */}

                                {answerArray.map((results) => {
                                    return (
                                        <Card.Text key={results} data-answer={results} onClick={handleAnswerClick}>
                                            {results}
                                        </Card.Text>
                                    )
                                })}
                                {/* <h2>Score: {score}</h2> */}
                            </Card.Body>
                            {/* {score}
                            {opponentScore} */}
                        </Card>
                    }
                </Col>
            </Row>
            {showSlider &&
                <Form.Range value={rangeValue} style={{width: `${rangeValue}%`, background:`${rangeColor}`, "border-radius": "25px", margin: "10px"}}/>
            }
        </Container>
    )
}
export default Game;