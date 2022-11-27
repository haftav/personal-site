import { List } from '../ui';
import { PageContainer } from './page-container';

export const Work = () => {
    return (
        <PageContainer title="Work">
            <List>
                <List.Item>
                    <List.Heading>
                        Lead frontend engineer - <i>Sliderule</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Currently leading frontend development of the
                            Sliderule web app, taking on responsibilities
                            ranging from frontend architectural decisions,
                            day-to-day feature work + prioritization, running
                            interviews, and helping build team culture
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Contract software engineer - <i>FarmRaise</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Planned and implemented command-line PDF generation
                            tool. Used Python to parse CSV data and output
                            completed PDF forms.
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Frontend developer - <i>PurposeWorks</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Implemented various features and enhancements on the
                            PurposeWorks client using React/TypeScript
                        </List.Item>
                        <List.Item>
                            Handled global application state and data fetching
                            with Redux action creators, selectors, and reducers
                        </List.Item>
                        <List.Item>
                            Integrated Google Analytics into client-side code to
                            gather user interaction data
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Frontend developer - <i>Overstock</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Maintained various customer-facing and internal
                            frontend React applications, Express rendering
                            services, and NodeJS/Express APIs
                        </List.Item>
                        <List.Item>
                            Developed new features for customer-facing
                            applications such as sitewide header, sales pages,
                            and homepage carousel
                        </List.Item>
                        <List.Item>
                            Architected and implemented overhaul for sitewide
                            search input to improve accessibility and overall
                            functionality. Improved and developed features for
                            internal applications, including company-wide CMS
                            and web performance dashboard
                        </List.Item>
                        <List.Item>
                            Unit-tested updates to reduce issues and improve
                            code stability. Performed bug fixes, monitored
                            application health, and assisted in deployment
                            process
                        </List.Item>
                    </List>
                </List.Item>
            </List>
        </PageContainer>
    );
};
