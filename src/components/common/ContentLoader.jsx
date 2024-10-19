import { Placeholder } from "react-bootstrap";

export default function ContentLoader() {
    return <>
        <Placeholder animation="glow">
            <Placeholder xs={10} className="rounded bg-secondary bg-opacity-25" />
        </Placeholder>
        <Placeholder animation="glow">
            <Placeholder xs={4} className="rounded bg-secondary bg-opacity-25" /> <Placeholder xs={4} className="rounded bg-secondary bg-opacity-25" />
            <Placeholder
                xs={4} className="rounded bg-secondary bg-opacity-25" />{' '}
            <Placeholder xs={6} className="rounded bg-secondary bg-opacity-25" /> <Placeholder xs={12} className="rounded bg-secondary bg-opacity-25" />
        </Placeholder>
    </>;
}