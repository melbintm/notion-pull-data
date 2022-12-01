class Service {
    private notion: any;
    private db: any;

    public getNotionClient = () => {
        return this.notion;
    }
    
    public setNotionClient = (notion: any) => {
        this.notion = notion
    }
}

export default new Service(); 
