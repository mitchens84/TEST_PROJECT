#!/usr/bin/env python3
"""
Airtable Workflow Data Extractor
--------------------------------
Extracts workflow data from a specified Airtable base and table,
saving it to a JSON file for visualization.

Usage:
    python airtable_workflow_extractor.py
    (Configuration is now read from integrations/airtable/airtable_config.json)
"""

import os
import json
import logging
from typing import Dict, List, Any, Optional
import requests
from dotenv import load_dotenv

# Load .env file at the very start for local development.
# This will load .env from the current working directory when the script is run.
# If the script is run from the /integrations/airtable directory, it will look for .env there.
# If run from the project root, it will look for .env in the project root.
# For GitHub Actions, AIRTABLE_API_KEY should be set as an environment variable directly.
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# The following line is redundant if load_dotenv() is called at the top
# and the .env file is in the project root or the script's execution directory.
# load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))


def fetch_and_save_airtable_data(base_id: str, table_id: str, view_id: Optional[str], api_key: str, output_file: str):
    """
    Fetches data from a specific Airtable view and saves it to a JSON file.
    If view_id is None, fetches all data from the table.
    """
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Build the URL
    url = f"https://api.airtable.com/v0/{base_id}/{table_id}"
    params: Dict[str, Any] = {}
    if view_id:
        params['view'] = view_id
        logger.info(f"Fetching data from base '{base_id}', table '{table_id}', view '{view_id}'...")
    else:
        logger.info(f"Fetching data from base '{base_id}', table '{table_id}' (no specific view)...")

    all_records: List[Dict[str, Any]] = []
    offset = None

    while True:
        if offset:
            params['offset'] = offset
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4XX or 5XX)
            
            data = response.json()
            all_records.extend(data.get("records", []))
            
            offset = data.get('offset')
            if not offset:
                break  # Exit loop if no more pages
        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP Request failed: {e}")
            # Depending on the error, you might want to retry or handle specific status codes
            if response is not None:
                logger.error(f"Response status code: {response.status_code}")
                logger.error(f"Response content: {response.text}")
            return # Stop processing this task if there's a request error

    # Ensure the output directory exists
    output_dir = os.path.dirname(output_file)
    if output_dir: # Check if output_dir is not an empty string (e.g. if output_file is just a filename)
        os.makedirs(output_dir, exist_ok=True)

    try:
        with open(output_file, 'w') as f:
            json.dump(all_records, f, indent=4)
        logger.info(f"Data successfully fetched and saved to {output_file}")
    except IOError as e:
        logger.error(f"Failed to write to output file {output_file}: {e}")


def main():
    api_key = os.environ.get("AIRTABLE_API_KEY")
    if not api_key:
        logger.error("Error: AIRTABLE_API_KEY environment variable not set.")
        logger.error("Please ensure AIRTABLE_API_KEY is set in your .env file (for local development) or as a GitHub Secret.")
        return

    # Determine the absolute path to the config file relative to this script file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_file_path = os.path.join(script_dir, 'airtable_config.json')

    try:
        with open(config_file_path, 'r') as f:
            config = json.load(f)
    except FileNotFoundError:
        logger.error(f"Error: Configuration file not found at {config_file_path}")
        return
    except json.JSONDecodeError:
        logger.error(f"Error: Could not decode JSON from {config_file_path}")
        return

    extraction_tasks = config.get("extractionTasks")
    if not extraction_tasks:
        logger.warning("No extraction tasks found in the configuration file.")
        return

    if not isinstance(extraction_tasks, list):
        logger.error("Error: 'extractionTasks' should be a list in the configuration file.")
        return

    for i, task in enumerate(extraction_tasks):
        task_name = task.get("taskName", f"Unnamed Task {i+1}")
        base_id = task.get("baseId")
        table_id = task.get("tableId")
        view_id = task.get("viewId")  # Can be None
        output_file_rel_path = task.get("outputFile") # Relative path from project root

        if not all([base_id, table_id, output_file_rel_path]):
            logger.warning(f"Skipping task '{task_name}' due to missing baseId, tableId, or outputFile.")
            continue
        
        # Construct absolute path for output file based on project root
        # Assuming the script is in /integrations/airtable, so ../../ is the project root
        project_root = os.path.abspath(os.path.join(script_dir, '..', '..'))
        output_file_abs_path = os.path.join(project_root, output_file_rel_path)

        logger.info(f"--- Running Task: {task_name} ---")
        fetch_and_save_airtable_data(base_id, table_id, view_id, api_key, output_file_abs_path)
        logger.info(f"--- Task: {task_name} Completed ---")


if __name__ == "__main__":
    main()
